import connection from "../config/db/connection.js"

export const getAllTables = async () => {
    const [results] = await connection.query(`
        SELECT 
            t.id,
            t.slug AS table_slug,
            t.name AS table_name,
            t.slug AS table_slug,
            i.name AS item_name,
            s.name AS item_size,
            isz.price AS item_price,
            oi.item_quantity,
            o.id AS order_id
        FROM tables t
        LEFT JOIN orders o ON t.slug = o.table_slug AND o.status = 'active'
        LEFT JOIN order_groups og ON o.id = og.order_id AND og.status = 'send'
        LEFT JOIN order_items oi ON og.id = oi.order_group_id
        LEFT JOIN items i ON oi.item_id = i.id
        LEFT JOIN sizes s ON oi.item_size_id = s.id
        LEFT JOIN item_sizes isz ON oi.item_id = isz.item_id AND oi.item_size_id = isz.size_id
        ORDER BY t.id
    `)
    return results
}

export const getTableBySlug = async (slug) => {
    const [results] = await connection.query(
        "SELECT * FROM tables WHERE slug = ?",
        [slug]
    )
    return results[0]
}

export const createTable = async ({ name, slug }) => {
    const [result] = await connection.query(
        "INSERT INTO tables (name, slug) VALUES (?, ?)",
        [name, slug]
    )
    return result
}

export const deleteTable = async (slug) => {
    const [result] = await connection.query(
        "DELETE FROM tables WHERE slug = ?",
        [slug]
    )
    return result
}