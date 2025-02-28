import connection from "../config/db/connection.js"

export const getSettings = async () => {
    const [settings] = await connection.query(
        "SELECT * FROM settings"
    );

    return settings;
}

export const updateLogoImage = async (logo) => {
    const [results] = await connection.query(
        "UPDATE settings SET value = ? WHERE `key` = 'logo'",
        [logo]
    )
    return results
}