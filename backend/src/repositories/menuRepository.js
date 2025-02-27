import connection from "../config/db/connection.js";

export const getMenu = async () => {
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
        GROUP BY c.id;
    `);

    return results;
};