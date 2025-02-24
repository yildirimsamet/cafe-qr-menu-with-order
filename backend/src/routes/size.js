import express from "express";
import connection from "../config/db/connection.js";
const router = express.Router();

// Get sizes
export const getSizes = async () => {
    const [results] = await connection.query(
        "SELECT * FROM sizes"
    );

    return results;
}

router.get("/", async (req, res) => {
    try {
        const results = await getSizes();

        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Edit size
export const editSize = async (id, name) => {
    const [results] = await connection.query(
        "UPDATE sizes SET name = ? WHERE id = ?",
        [name, id]
    );

    return results;
}

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const results = await editSize(id, name);

        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// add size
export const addSize = async (name) => {
    const [results] = await connection.query(
        "INSERT INTO sizes (name) VALUES (?)",
        [name]
    );

    return results;
}

router.post("/", async (req, res) => {
    const { name } = req.body;
    try {
        const results = await addSize(name);

        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})
export const deleteSize = async (id) => {
    const [results] = await connection.query(
        "DELETE FROM sizes WHERE id = ?",
        [id]
    );

    return results;
}

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const results = await deleteSize(id);

        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

export default router;