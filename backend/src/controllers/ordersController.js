import * as ordersService from '../services/ordersService.js'

export const getOrders = async (req, res) => {
    try {
        const results = await ordersService.getOrders()
        res.json({
            status: 200,
            data: results
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const createOrder = async (req, res) => {
    const { table_slug, items } = req.body
    const waiter_id = req.user?.id

    try {
        const results = await ordersService.saveOrderToDatabase({ 
            table_slug, 
            items,
            waiter_id 
        })
        res.json({ status: 200, data: results })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const updateOrderStatus = async (req, res) => {
    const { order_group_id } = req.params
    const { status } = req.body
    const waiter_id = req.user?.id

    try {
        const results = await ordersService.updateOrderStatus({ 
            order_group_id, 
            status,
            waiter_id 
        })
        res.json({ status: 200, data: results })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const completeOrder = async (req, res) => {
    const { order_id } = req.params

    try {
        const results = await ordersService.completeOrder({ order_id })
        res.json({ status: 200, data: results })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}