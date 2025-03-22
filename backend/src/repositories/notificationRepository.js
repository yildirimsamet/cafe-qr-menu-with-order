import connection from "../config/db/connection.js";

export const createNotification = async ({ message, type, table_slug }) => {
    const [result] = await connection.query(
        "INSERT INTO notifications (message, type, table_slug) VALUES (?, ?, ?)",
        [message, type, table_slug]
    );

    return result;
}

export const deleteNotification = async (id) => {
    const [result] = await connection.query(
        "DELETE FROM notifications WHERE id = ?",
        [id]
    );

    return result;
}

export const getAllNotifications = async () => {
    const [results] = await connection.query(
        `
        SELECT 
            n.id,
            n.message,
            n.type,
            n.created_at,
            n.table_slug,
            t.name AS table_name
        FROM notifications n
        LEFT JOIN tables t ON n.table_slug = t.slug
        `
    );

    return results;
}