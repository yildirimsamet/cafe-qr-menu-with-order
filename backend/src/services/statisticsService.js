import * as statisticsRepository from '../repositories/statisticsRepository.js'

export const getProductsSellCount = async ({ startDate, endDate, products }) => {
    try {
        const results = await statisticsRepository.getProductsSellCount({ startDate, endDate, products })
        return results;
    } catch (error) {
        throw error;
    }
}

export const getTableOrderCount = async ({ startDate, endDate }) => {
    try {
        const results = await statisticsRepository.getTableOrderCount({ startDate, endDate });
        return results;
    } catch (error) {
        throw error;
    }
}

export const getOrders = async ({ startDate, endDate, tableSlug }) => {
    try {
        const results = await statisticsRepository.getOrders({ startDate, endDate, tableSlug });
        return results;
    } catch (error) {
        throw error;
    }
}

