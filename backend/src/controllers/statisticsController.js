import * as statisticsService from '../services/statisticsService.js';

export const getProductsSellCount = async (req, res) => {
    const { startDate, endDate } = req.params;
    const { products } = req.body;

    try {
        const results = await statisticsService.getProductsSellCount({ startDate, endDate, products });
        res.json({
            status: 200,
            data: results
        })  
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getTableOrderCount = async (req, res) => {
    const { startDate, endDate } = req.params;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: "startDate and endDate parameters are required" });
    }

    try {
        const results = await statisticsService.getTableOrderCount({ startDate, endDate });
        res.json({
            status: 200,
            data: results
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getOrders = async (req, res) => {
    const { startDate, endDate } = req.params;
    const { tableSlug } = req.body;

    try {
        const results = await statisticsService.getOrders({ startDate, endDate, tableSlug });
        res.json({
            status: 200,
            data: results
        })  
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}
