import * as menuService from '../services/menuService.js'

export const getMenu = async (req, res) => {
    try {
        const results = await menuService.getMenu()
        res.json({
            status: 200,
            data: results
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}