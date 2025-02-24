import express from "express";
import connection from "../config/db/connection.js";
import slugify from "slugify";
const router = express.Router();


router.get('/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const [results] = await connection.query(`SELECT * from tables WHERE slug = ?`, [slug]);
        res.json({ status: 200, data: results[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get("/", async (req, res) => {
    try {
        const [results] = await connection.query(`SELECT 
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
ORDER BY t.id;
`);

        const tables = {};
        results.forEach(row => {
            if (!tables[row.table_name]) {
                tables[row.table_name] = {
                    table_name: row.table_name,
                    items: [],
                    order_id: row.order_id,
                    table_slug: row.table_slug,
                };
            }

            if (row.item_name && row.item_size) {
                const existingItem = tables[row.table_name].items.find(item => item.item_name === row.item_name && item.item_size === row.item_size);

                if (existingItem) {
                    existingItem.item_quantity += row.item_quantity;
                } else {
                    tables[row.table_name].items.push({
                        item_name: row.item_name,
                        item_size: row.item_size,
                        item_quantity: row.item_quantity,
                        item_price: row.item_price
                    });
                }
            }
        });

        const formattedData = Object.values(tables);

        res.json({
            status: 200,
            data: formattedData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/", async (req, res) => {
    const { name } = req.body;
    try {
        const slug = slugify(name, {
            lower: true,
            remove: /[*+~.()'"!:@]/g
        });

        const [results, fields] = await connection.query(
            "INSERT INTO tables (name, slug) VALUES (?, ?)", [name, slug],
            [name]
        );

        res.json({
            status: 200,
            data: results
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/:slug", async (req, res) => {
    const { slug } = req.params;
    
    if(req?.user?.role !== 'admin') {
        return res.status(403).json({ error: "Forbidden: insufficient role" });
    }

    try {
        const [results, fields] = await connection.query("DELETE FROM tables WHERE slug = ?", [slug]);
        res.json({
            status: 200,
            data: results
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
