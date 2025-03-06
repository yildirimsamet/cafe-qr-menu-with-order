import connection from "../config/db/connection.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const findUserByUsername = async (username) => {
    const [user] = await connection.query("SELECT * FROM users WHERE username = ?", [username]);
    return user[0];
};

export const getUserById = async (id) => {
    const [user] = await connection.query("SELECT * FROM users WHERE id = ?", [id]);
    return user[0];
};

export const createUser = async ({ username, password, role }) => {
    const [results] = await connection.query(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [username, password, role]
    );
    return results.insertId;
};

export const updateUser = async (id, { password, role, username }) => {
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

    const [results] = await connection.query(query, params);
    return results.affectedRows > 0;
};

export const deleteUser = async (id) => {
    const [results] = await connection.query("DELETE FROM users WHERE id = ?", [id]);
    return results.affectedRows > 0;
};

export const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '999999d',
    });
};

