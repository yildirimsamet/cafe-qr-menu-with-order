import express from "express";
import connection from "../config/db/connection.js";
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [results, fields] = await connection.query("SELECT id, role, username FROM users");
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