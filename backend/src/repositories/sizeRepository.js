import connection from "../config/db/connection.js"

export const getAllSizes = async () => {
    const [sizes] = await connection.query(
        "SELECT * FROM sizes"
    )
    return sizes
}

export const getSizeById = async (id) => {
    const [sizes] = await connection.query(
        "SELECT * FROM sizes WHERE id = ?",
        [id]
    )
    return sizes[0]
}

export const getSizeByName = async (name) => {
    const [sizes] = await connection.query(
        "SELECT * FROM sizes WHERE name = ?",
        [name]
    )
    return sizes[0]
}

export const createSize = async ({ name }) => {
    const [result] = await connection.query(
        "INSERT INTO sizes (name) VALUES (?)",
        [name]
    )
    return result.insertId
}

export const deleteSize = async ({ id }) => {
    const [result] = await connection.query(
        "DELETE FROM sizes WHERE id = ?",
        [id]
    )
    return result
}

export const editSize = async ({ id, name }) => {
    const [result] = await connection.query(
        "UPDATE sizes SET name = ? WHERE id = ?",
        [name, id]
    )
    return result
}