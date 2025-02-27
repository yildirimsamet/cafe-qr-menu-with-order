import connection from "../config/db/connection.js"

export const getUsers = async () => {
    const [users] = await connection.query(
        "SELECT id, role, username FROM users"
    );

    return users;
}

export const getUserById = async (id) => {
    const [user] = await connection.query(
        "SELECT id, role, username FROM users WHERE id = ?",
        [id]
    );

    return user;
}