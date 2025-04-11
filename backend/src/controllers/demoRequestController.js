import * as demoRequestService from '../services/demoRequestService.js';

export const createDemoRequest = async (req, res) => {
    try {
        const result = await demoRequestService.createDemoRequest(req.body);
        res.status(201).json({ status: 201, data: result });
    } catch (error) {
        console.error("Error in createDemoRequest controller:", error);
        if (error.message === "Phone number is required") {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getDemoRequests = async (req, res) => {
    try {
        const requests = await demoRequestService.getDemoRequests();
        res.json({ status: 200, data: requests });
    } catch (error) {
        console.error("Error in getDemoRequests controller:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteDemoRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await demoRequestService.deleteDemoRequest(id);
        res.json({ status: 200, data: result });
    } catch (error) {
        console.error("Error in deleteDemoRequest controller:", error);
        if (error.message.includes("not found")) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};
