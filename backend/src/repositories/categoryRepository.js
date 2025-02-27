import connection from "../config/db/connection.js"

export const getAllCategories = async () => {
    const [categories] = await connection.query(
        "SELECT * FROM categories"
    )
    return categories
}

export const getCategoryById = async (id) => {
    const [categories] = await connection.query(
        "SELECT * FROM categories WHERE id = ?",
        [id]
    )
    return categories[0]
}

export const getCategoryByName = async (name) => {
    const [categories] = await connection.query(
        "SELECT * FROM categories WHERE name = ?",
        [name]
    )
    return categories[0]
}

export const createCategory = async ({ name }) => {
    const [result] = await connection.query(
        "INSERT INTO categories (name) VALUES (?)",
        [name]
    )
    return result.insertId
}

export const updateCategory = async ({ id, name }) => {
    const [result] = await connection.query(
        "UPDATE categories SET name = ? WHERE id = ?",
        [name, id]
    )
    return result
}

export const deleteCategory = async ({ id }) => {
    const [result] = await connection.query(
        "DELETE FROM categories WHERE id = ?",
        [id]
    )
    return result
}