import * as usersService from '../services/usersService.js'

export const getUsers = async (req, res) => {
    try {
        const users = await usersService.getUsers();
        res.json({
            status: 200,
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await usersService.getUserById(id);
        res.json({
            status: 200,
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
