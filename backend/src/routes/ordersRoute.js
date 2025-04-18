import express from "express";
import connection from "../config/db/connection.js";
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [results, fields] = await connection.query(`
            SELECT 
    og.status AS order_group_status,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'order_group_id', og.id,
            'order_group_note', og.note,
            'order_id', og.order_id,
            'created_at', og.created_at,
            'tableSlug', o.table_slug,
            'tableName', t.name,
            'updatedBy', u.username,
            'items', (
                SELECT COALESCE(JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'item_id', i.id,
                        'item_image', i.image,
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
LEFT JOIN users u ON og.updated_by = u.username
WHERE o.status = 'active'
GROUP BY og.status;
        `);
        const formattedData = { waiting: [], send: [] };

        results.forEach(group => {
            formattedData[group.order_group_status] = [
                ...formattedData[group.order_group_status],
                ...group.grouped_data
            ];
        });
        res.json({
            status: 200,
            data: formattedData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update Order Group Status
const updateOrderGroupStatus = async (order_group_id, status, username) => {
    let query = "UPDATE order_groups SET status = ?";
    const params = [status];

    if (username) {
        query += ", updated_by = ?";
        params.push(username);
    }

    query += " WHERE id = ?";
    params.push(order_group_id);

    const [results] = await connection.query(query, params);

    return results;
}

router.put("/order_groups/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const username = req?.user?.username;
    try {
        const results = await updateOrderGroupStatus(id, status, username);

        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete Order Group
const deleteOrderGroup = async (order_group_id) => {
    const [results] = await connection.query(
        "DELETE FROM order_groups WHERE id = ?",
        [order_group_id]
    );

    const [results2] = await connection.query(
        "DELETE FROM order_items WHERE order_group_id = ?",
        [order_group_id]
    );

    return !!results && !!results2;
}

router.delete("/order_groups/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const results = await deleteOrderGroup(id);
        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Complete Order
const completeOrder = async (order_id) => {
    const now = new Date(Date.now() + (3 * 60 * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ');

    const [results] = await connection.query(
        "UPDATE orders SET status = 'done', done_at = ? WHERE id = ?",
        [now, order_id]
    );

    return results;
}

router.put("/:id/done", async (req, res) => {
    const { id } = req.params;

    try {
        const results = await completeOrder(id);

        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get(`/last/:table_slug`, async (req, res) => {
    const { table_slug } = req.params;
    try {
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
        WHERE o.status = 'done' AND o.table_slug = ? AND o.done_at >= DATE_SUB(NOW(), INTERVAL 18 HOUR)
        GROUP BY o.id
        `, [table_slug]);
        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

export default router;