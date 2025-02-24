import express from "express";
import connection from "../config/db/connection.js";
import multer from "multer";
import slugify from "slugify";
import path from "path";
import fs from "fs";
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [results, fields] = await connection.query(`
            SELECT
            c.id AS category_id,
                c.name AS category_name,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'item_id', i.id,
                        'item_name', i.name,
                        'item_description', i.description,
                        'item_image', i.image,
                        'sizes', (
                            SELECT JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'size_id', s.id,
                                    'size_name', s.name,
                                    'size_price', isz.price
                                )
                            ) FROM item_sizes isz JOIN sizes s ON isz.size_id = s.id WHERE isz.item_id = i.id
                        )
                    )
                ) AS items
            FROM categories c
            LEFT JOIN items i ON c.id = i.category_id
            GROUP BY c.id;
        `);

        const editedResults = results.map((result) => {
            return {
                ...result,
                items: result.items.filter((item) => (item.sizes !== null || item.sizes && item.sizes.length > 0)),
            };
        })
        res.json(editedResults);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ---------------------------

const uploadPath = "public/assets/images";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = slugify(path.basename(file.originalname, ext), { lower: true }) + Date.now() + ext;
        cb(null, filename);
    }
});

const upload = multer({ storage });

const addItem = async (name, description, category_id, image) => {
    const [results] = await connection.query(
        "INSERT INTO items (name, description, category_id, image) VALUES (?, ?, ?, ?)",
        [name, description, category_id, image]
    );
    return results;
};

const addItemSizes = async (item_id, sizes) => {
    const queries = sizes.map((sizeInfo) => {
        const { size_id, price } = JSON.parse(sizeInfo);

        return connection.query("INSERT INTO item_sizes (item_id, size_id, price) VALUES (?, ?, ?)", [item_id, size_id, price]);
    });
    try {
        await Promise.all(queries);
    } catch (error) {
        console.error("Error adding item sizes:", error);
        throw error;
    }
};

router.post("/add", upload.single("image"), async (req, res) => {
    const { name, description, category, sizes } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        const addItemResult = await addItem(name, description, category, image);

        await addItemSizes(addItemResult.insertId, sizes);

        res.json({ status: 200, data: addItemResult });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await connection.query("DELETE FROM items WHERE id = ?", [id]);

        if (results.affectedRows === 0 ) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.put("/edit/:id", upload.single("image"), async (req, res) => {
    const { id } = req.params;
    const { name, description, category, sizes } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        let query = "UPDATE items SET name = ?, description = ?, category_id = ?";
        let params = [name, description, category];

        if (image) {
            query += ", image = ?";
            params.push(image);
        }

        query += " WHERE id = ?";
        params.push(id);

        const [results] = await connection.query(query, params);

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Item not found" });
        }    

        await connection.query("DELETE FROM item_sizes WHERE item_id = ?", [id]);
        await addItemSizes(id, sizes);

        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;