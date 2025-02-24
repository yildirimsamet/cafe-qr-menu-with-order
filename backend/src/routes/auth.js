import express from "express";
import connection from "../config/db/connection.js";
const router = express.Router();
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const [user] = await connection.query("SELECT * FROM users WHERE username = ?", [username]);

        if (user.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user[0].password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user[0].id, role: user[0].role, username: user[0].username, }, process.env.JWT_SECRET, {
            expiresIn: '999999d',
        });

        res.json({ status: 200, token, user: { id: user[0].id, role: user[0].role, username: user[0].username, } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/register", async (req, res) => {
    if (req?.user?.role !== 'admin') {
        return res.status(403).json({ error: "Forbidden: insufficient role" });
    }

    const { password, role, username } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [results] = await connection.query(
            "INSERT INTO users (password, role, username) VALUES (?, ?, ?)",
            [hashedPassword, role, username]
        );

        if (results.affectedRows === 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        const token = jwt.sign({ id: results.insertId, role, username }, process.env.JWT_SECRET, {
            expiresIn: '999999d',
        });

        res.json({ status: 200, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { password, role, username } = req.body;
    let query = "UPDATE users SET ";
    const params = [];

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        query += " password = ?,";
        params.push(hashedPassword);
    }

    if (role) {
        query += " role = ?,";
        params.push(role);
    }

    if (username) {
        query += " username = ?,";
        params.push(username);
    }

    query = query.slice(0, -1) + " WHERE id = ?";
    params.push(id);

    try {
        const [results] = await connection.query(query, params);

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ status: 200, message: "User updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await connection.query("DELETE FROM users WHERE id = ?", [id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ status: 200, message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/user", async (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ status: 200, data: decoded });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;

