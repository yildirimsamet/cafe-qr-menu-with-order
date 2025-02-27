import * as categoryService from '../services/categoryService.js';

export const getCategories = async (req, res) => {
    try {
        const results = await categoryService.getCategories();
        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const editCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const results = await categoryService.editCategory({ id, name });
        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const addCategory = async (req, res) => {
    const { name } = req.body;

    try {
        const results = await categoryService.addCategory({ name });
        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const results = await categoryService.deleteCategory({ id });
        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};