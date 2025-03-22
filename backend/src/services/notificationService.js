import * as notificationRepository from "../repositories/notificationRepository.js"

export const createNotification = async ({ message, type, table_slug }) => {
    try {
        const result = await notificationRepository.createNotification({ message, type, table_slug })
        return result
    } catch (error) {
        throw error
    }
}

export const getAllNotifications = async () => {
    try {
        const results = await notificationRepository.getAllNotifications()
        return results
    } catch (error) {
        throw error
    }
}

export const deleteNotification = async (id) => {
    try {
        const result = await notificationRepository.deleteNotification(id)
        return result
    } catch (error) {
        throw error
    }
}