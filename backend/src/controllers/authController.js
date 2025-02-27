import * as authService from '../services/authService.js';

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await authService.login({ username, password });

        res.json({
            status: 200,
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const register = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const result = await authService.register({ username, password, role });

        res.json({
            status: 200,
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, password, role } = req.body;

    try {
        const result = await authService.updateUser(id, { username, password, role });

        res.json({
            status: 200,
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await authService.deleteUser(id);

        res.json({
            status: 200,
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getUser = async (req, res) => {
    const { token } = req.body;

    try {
        const result = await authService.getUser({ token });

        res.json({
            status: 200,
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
