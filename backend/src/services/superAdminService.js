import connection from "../config/db/connection.js";
import bcrypt from "bcrypt";

export const createSuperAdmin = async () => {
    try {
        const [results] = await connection.query("SELECT * FROM users WHERE role = 'superadmin'");

        if (results.length === 0) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            await connection.query(
                "INSERT INTO users (password, role, username) VALUES (?, 'superadmin', ?)",
                [hashedPassword, process.env.ADMIN_USERNAME]
            );
        }
        return results;
    } catch (err) {
        throw err;
    }
}
