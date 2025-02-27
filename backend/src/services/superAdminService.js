
import connection from "../config/db/connection.js";
import bcrypt from "bcrypt";

export const createSuperAdmin = () => {
    return new Promise((resolve, reject) => {
        const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);
        connection.query(
            "REPLACE INTO users (password, role, username) VALUES (?, 'superadmin', ?)",
            [hashedPassword, process.env.ADMIN_USERNAME],
            (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            }
        );
    });
}