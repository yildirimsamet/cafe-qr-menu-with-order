import connection from "../config/db/connection.js"

export const getAllOrders = async () => {
    const [results] = await connection.query(`
        SELECT 
            og.status AS order_group_status,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'order_group_id', og.id,
                    'order_id', og.order_id,
                    'created_at', og.created_at,
                    'tableSlug', o.table_slug,
                    'tableName', t.name,
                    'waiterName', u.username,
                    'items', (
                        SELECT COALESCE(JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'item_id', i.id,
                                'item_name', i.name,
                                'item_size', s.name,
                                'item_price', isz.price,
                                'item_quantity', oi.item_quantity
                            )
                        ), JSON_ARRAY())
                        FROM order_items oi
                        JOIN items i ON oi.item_id = i.id
                        LEFT JOIN sizes s ON oi.item_size_id = s.id
                        LEFT JOIN item_sizes isz ON oi.item_id = isz.item_id AND oi.item_size_id = isz.size_id
                        WHERE oi.order_group_id = og.id
                    )
                )
            ) AS grouped_data
        FROM order_groups og
        JOIN orders o ON og.order_id = o.id
        JOIN tables t ON o.table_slug = t.slug
        LEFT JOIN users u ON og.waiter_id = u.id
        WHERE o.status = 'active'
        GROUP BY og.status
    `)
    return results
}

export const getActiveOrderByTableSlug = async (table_slug) => {
    const [results] = await connection.query(
        "SELECT * FROM orders WHERE table_slug = ? AND status = 'active'",
        [table_slug]
    )
    return results
}

export const createNewOrder = async (table_slug) => {
    const [results] = await connection.query(
        "INSERT INTO orders (table_slug, status) VALUES (?, 'active')",
        [table_slug]
    )
    return results
}

export const createNewOrderGroup = async (order_id) => {
    const [results] = await connection.query(
        "INSERT INTO order_groups (order_id, status) VALUES (?, 'waiting')",
        [order_id]
    )
    return results
}

export const addOrderItems = async (order_group_id, item_id, item_size_id, item_quantity) => {
    const [results] = await connection.query(
        "INSERT INTO order_items (order_group_id, item_id, item_size_id, item_quantity) VALUES (?, ?, ?, ?)",
        [order_group_id, item_id, item_size_id, item_quantity]
    )
    return results
}

export const updateOrderGroupStatus = async ({ order_group_id, status, waiter_id }) => {
    let query = "UPDATE order_groups SET status = ?"
    const params = [status]

    if (waiter_id) {
        query += ", waiter_id = ?"
        params.push(waiter_id)
    }

    query += " WHERE id = ?"
    params.push(order_group_id)

    const [results] = await connection.query(query, params)
    return results
}

export const completeOrder = async (order_id) => {
    const [results] = await connection.query(
        "UPDATE orders SET status = 'done' WHERE id = ?",
        [order_id]
    )
    return results
}