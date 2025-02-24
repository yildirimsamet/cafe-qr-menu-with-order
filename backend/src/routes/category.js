import express from "express";
import connection from "../config/db/connection.js";
const router = express.Router();

// Get categories
export const getCategories = async () => {
    const [results] = await connection.query(
        "SELECT * FROM categories"
    );

    return results;
}

router.get("/", async (req, res) => {
    try {
        const results = await getCategories();

        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Edit category
export const editCategory = async (id, name) => {
    const [results] = await connection.query(
        "UPDATE categories SET name = ? WHERE id = ?",
        [name, id]
    );

    return results;
}

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const results = await editCategory(id, name);

        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Create category
export const addCategory = async (name) => {
    const [results] = await connection.query(
        "INSERT INTO categories (name) VALUES (?)",
        [name]
    );

    return results;
}

router.post("/", async (req, res) => {
    const { name } = req.body;
    try {
        const results = await addCategory(name);

        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

//Delete category
export const deleteCategory = async (id) => {
    const [results] = await connection.query(
        "DELETE FROM categories WHERE id = ?",
        [id]
    );

    return results;
}

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const results = await deleteCategory(id);

        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

export default router;