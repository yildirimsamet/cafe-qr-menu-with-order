import connection from "../config/db/connection.js"

export const getAllItems = async () => {
    const [results] = await connection.query(`
        SELECT
            c.id AS category_id,
            c.name AS category_name,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'item_id', i.id,
                    'item_name', i.name,
                    'item_description', i.description,
                    'item_image', i.image,
                    'sizes', (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'size_id', s.id,
                                'size_name', s.name,
                                'size_price', isz.price
                            )
                        ) FROM item_sizes isz JOIN sizes s ON isz.size_id = s.id WHERE isz.item_id = i.id
                    )
                )
            ) AS items
        FROM categories c
        LEFT JOIN items i ON c.id = i.category_id
        GROUP BY c.id
    `)
    return results
}

export const createItem = async ({ name, description, category_id, image }) => {
    const [result] = await connection.query(
        "INSERT INTO items (name, description, category_id, image) VALUES (?, ?, ?, ?)",
        [name, description, category_id, image]
    )
    return result
}

export const addItemSizes = async (item_id, sizes) => {
    const queries = sizes.map((sizeInfo) => {
        const { size_id, price } = sizeInfo;

        return connection.query(
            "INSERT INTO item_sizes (item_id, size_id, price) VALUES (?, ?, ?)", 
            [item_id, size_id, price]
        )
    })
    
    return await Promise.all(queries)
}

export const deleteItem = async (id) => {
    const [result] = await connection.query(
        "DELETE FROM items WHERE id = ?",
        [id]
    )
    return result
}

export const editItem = async ({ id, name, description, category_id, image }) => {
    let query = "UPDATE items SET name = ?, description = ?, category_id = ?"
    let params = [name, description, category_id]

    if (image) {
        query += ", image = ?"
        params.push(image)
    }

    query += " WHERE id = ?"
    params.push(id)

    const [result] = await connection.query(query, params)
    return result
}

export const deleteItemSizes = async (item_id) => {
    const [result] = await connection.query(
        "DELETE FROM item_sizes WHERE item_id = ?",
        [item_id]
    )
    return result
}