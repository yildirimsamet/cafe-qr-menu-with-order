import connection from "../config/db/connection.js";

export const getProductsSellCount = async ({ startDate, endDate, products }) => {
    if (!Array.isArray(products) || products.length === 0) return [];

    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateList = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dateList.push(new Date(d).toISOString().split('T')[0]);
    }

    const query = `
        SELECT 
            DATE(created_at) AS date, 
            SUM(item_quantity) AS total_quantity, 
            item_id AS productId, 
            item_size_id AS sizeId
        FROM order_items 
        WHERE (item_id, item_size_id) IN (${products.map(() => "(?, ?)").join(", ")})
        AND created_at BETWEEN ? AND ? 
        GROUP BY DATE(created_at), item_id, item_size_id`;

    const queryParams = products.flatMap(({ productId, sizeId }) => [productId, sizeId]);
    queryParams.push(startDate, endDate);

    const [rawResults] = await connection.query(query, queryParams);

    const resultMap = new Map();
    rawResults.forEach(row => {
        const date = new Date(row.date).toISOString().split('T')[0];
        const key = `${row.productId}-${row.sizeId}-${date}`;
        resultMap.set(key, {
            ...row,
            date
        });
    });

    const filledResults = [];
    for (const { productId, sizeId } of products) {
        for (const date of dateList) {
            const key = `${productId}-${sizeId}-${date}`;
            if (resultMap.has(key)) {
                filledResults.push(resultMap.get(key));
            } else {
                filledResults.push({
                    date,
                    total_quantity: 0,
                    productId,
                    sizeId
                });
            }
        }
    }

    return filledResults;
};

export const getTableOrderCount = async ({ startDate, endDate }) => {
    const [tableRows] = await connection.query("SELECT slug FROM tables");
    const currentTableSlugs = tableRows.map(row => row.slug);

    if (currentTableSlugs.length === 0) return [];

    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateList = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dateList.push(new Date(d).toISOString().split('T')[0]);
    }

    const query = `
        SELECT
            DATE(o.created_at) AS date,
            o.table_slug,
            COUNT(o.id) AS order_count
        FROM orders o
        JOIN tables t ON o.table_slug = t.slug -- Ensures we only count orders for existing tables
        WHERE o.created_at >= ? AND o.created_at < DATE_ADD(?, INTERVAL 1 DAY)
        GROUP BY DATE(o.created_at), o.table_slug
        ORDER BY date, o.table_slug;
    `;

    const [rawResults] = await connection.query(query, [startDate, endDate]);

    const resultMap = new Map();
    rawResults.forEach(row => {
        const date = new Date(row.date).toISOString().split('T')[0];
        const key = `${row.table_slug}-${date}`;
        resultMap.set(key, {
            date,
            table_slug: row.table_slug,
            order_count: Number(row.order_count)
        });
    });

    const finalResults = [];
    for (const tableSlug of currentTableSlugs) {
        for (const date of dateList) {
            const key = `${tableSlug}-${date}`;
            if (resultMap.has(key)) {
                finalResults.push(resultMap.get(key));
            } else {
                finalResults.push({
                    date,
                    table_slug: tableSlug,
                    order_count: 0
                });
            }
        }
    }

    finalResults.sort((a, b) => {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        if (a.table_slug < b.table_slug) return -1;
        if (a.table_slug > b.table_slug) return 1;
        return 0;
    });


    return finalResults;
};

export const getOrders = async ({ startDate, endDate, tableSlug }) => {
    console.log(startDate, endDate, tableSlug);
    if (!tableSlug) return [];

    const [results] = await connection.query(`
        SELECT 
            o.id AS order_id,
            o.table_slug,
            o.done_at,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'item_name', i.name,
                    'item_size', s.name,
                    'item_price', isz.price,
                    'item_quantity', oi.item_quantity
                )
            ) AS items
        FROM orders o
        LEFT JOIN order_groups og ON o.id = og.order_id AND og.status = 'send'
        LEFT JOIN order_items oi ON og.id = oi.order_group_id
        LEFT JOIN items i ON oi.item_id = i.id
        LEFT JOIN sizes s ON oi.item_size_id = s.id
        LEFT JOIN item_sizes isz ON oi.item_id = isz.item_id AND oi.item_size_id = isz.size_id
        WHERE o.status = 'done' AND o.table_slug = ? AND o.done_at >= ? AND o.done_at <= ?
        GROUP BY o.id
        `, [tableSlug, startDate, endDate]);

    return results;
};
