import express from "express";
import connection from "../config/db/connection.js";
const router = express.Router();

// Create Order
export const createOrder = async (table_slug) => {
    const [results] = await connection.query(
        "INSERT INTO orders (table_slug, status) VALUES (?, 'active')",
        [table_slug]
    );

    return results;
}

router.post("/orders", async (req, res) => {
    const { table_slug } = req.body;
    try {
        const results = await createOrder(table_slug);

        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get Active Orders by Table ID
export const getActiveOrdersByTableSlug = async (table_slug) => {
    const [results] = await connection.query(
        "SELECT * FROM orders WHERE table_slug = ? AND status = 'active' LIMIT 1",
        [table_slug]
    );

    return results;
}

router.get("/orders/:table_slug", async (req, res) => {
    const { table_slug } = req.params;
    try {
        const results = await getActiveOrdersByTableSlug(table_slug);

        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Create Order Group (Reuse Active Order or Create New One)
export const getActiveOrderIdByTableSlug = async (tableSlug) => {
    const [results] = await connection.query(
        "SELECT id FROM orders WHERE table_slug = ? AND status = 'active' LIMIT 1",
        [tableSlug]
    );

    return results;
}

export const createOrderGroup = async (order_id) => {
    const [results] = await connection.query(
        "INSERT INTO order_groups (order_id, status) VALUES (?, 'waiting')",
        [order_id]
    );

    return results;
}

router.post("/order_groups", async (req, res) => {
    const { table_slug } = req.body;
    try {
        const order = await getActiveOrderIdByTableSlug(table_slug);

        let order_id;

        if (order.length > 0) {
            order_id = order[0].id;
        } else {
            const newOrder = await createOrder(table_slug);

            order_id = newOrder.insertId;
        }

        const results = await createOrderGroup(order_id);

        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Add Order Item
export const addOrderItem = async (order_group_id, item_id, item_size_id, item_quantity) => {
    const [results] = await connection.query(
        "INSERT INTO order_items (order_group_id, item_id, item_size_id, item_quantity) VALUES (?, ?, ?, ?)",
        [order_group_id, item_id, item_size_id, item_quantity]
    );

    return results;
}

router.post("/order_items", async (req, res) => {
    const { order_group_id, item_id, item_size_id, quantity } = req.body;
    try {
        const results = await addOrderItem(order_group_id, item_id, item_size_id, quantity);

        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
