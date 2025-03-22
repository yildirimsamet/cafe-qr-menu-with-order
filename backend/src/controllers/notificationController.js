import * as notificationService from '../services/notificationService.js';

export const createNotification = async (req, res) => {
    const { message, type, table_slug } = req.body;
    try {
        const result = await notificationService.createNotification({ message, type, table_slug })
        res.json({
            status: 200,
            data: result
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getAllNotifications = async (req, res) => {
    try {
        const results = await notificationService.getAllNotifications()
        res.json({
            status: 200,
            data: results
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const deleteNotification = async (req, res) => {
    try {
        const result = await notificationService.deleteNotification(req.params.id)
        res.json({
            status: 200,
            data: result
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}
