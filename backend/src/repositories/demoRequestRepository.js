import connection from "../config/db/connection.js";

export const createDemoRequest = async ({ business_name, email, phone, message }) => {
    const [result] = await connection.query(
        "INSERT INTO demo_requests (business_name, email, phone, message) VALUES (?, ?, ?, ?)",
        [business_name, email, phone, message]
    );
    return result.insertId;
};

export const getAllDemoRequests = async () => {
    const [requests] = await connection.query(
        "SELECT * FROM demo_requests ORDER BY created_at DESC"
    );
    return requests;
};

export const deleteDemoRequest = async (id) => {
    const [result] = await connection.query(
        "DELETE FROM demo_requests WHERE id = ?",
        [id]
    );
    return result.affectedRows > 0;
};
