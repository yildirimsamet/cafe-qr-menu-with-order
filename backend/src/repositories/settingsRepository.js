import { deleteImage } from "../../utils/index.js";
import connection from "../config/db/connection.js"

export const getSettings = async () => {
    const [settings] = await connection.query(
        "SELECT * FROM settings"
    );

    return settings;
}

export const updateLogoImage = async (logo) => {
    const [[{ value: oldLogo }]] = await connection.query(
        "SELECT value FROM settings WHERE `key` = 'logo'"
    );


    const [results] = await connection.query(
        "UPDATE settings SET value = ? WHERE `key` = 'logo'",
        [logo]
    )

    if (results.affectedRows && oldLogo) {
        deleteImage(oldLogo);
    }

    return results
}

export const updateColors = async (colors) => {
    const [results] = await connection.query(
        "UPDATE settings SET value = ? WHERE `key` = 'colors'",
        [colors]
    )
    return results
}

export const updateContactInfo = async ({ address, phoneNumber, companyName }) => {
    const [addressResult] = await connection.query(
        "UPDATE settings SET value = ? WHERE `key` = 'address'",
        [address]
    );
    const [phoneNumberResult] = await connection.query(
        "UPDATE settings SET value = ? WHERE `key` = 'phoneNumber'",
        [phoneNumber]
    );
    const [companyNameResult] = await connection.query(
        "UPDATE settings SET value = ? WHERE `key` = 'companyName'",
        [companyName]
    );

    return !!addressResult.affectedRows && !!phoneNumberResult.affectedRows && !!companyNameResult.affectedRows
}
