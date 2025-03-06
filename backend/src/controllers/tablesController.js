import * as tablesService from '../services/tablesService.js'

export const getTables = async (req, res) => {
    try {
        const results = await tablesService.getTables()
        res.json({
            status: 200,
            data: results
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getTable = async (req, res) => {
    const { slug } = req.params
    
    try {
        const results = await tablesService.getTable(slug)
        res.json({
            status: 200,
            data: results
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const addTable = async (req, res) => {
    if(req?.user?.role !== 'admin' && req?.user?.role !== 'superadmin') {
        return res.status(403).json({ error: "Forbidden: insufficient role" })
    }

    const { name } = req.body

    try {
        const results = await tablesService.addTable({ name })
        res.json({
            status: 200,
            data: results
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const deleteTable = async (req, res) => {
    const { slug } = req.params
    
    if(req?.user?.role !== 'admin' && req?.user?.role !== 'superadmin') {
        return res.status(403).json({ error: "Forbidden: insufficient role" })
    }

    try {
        const results = await tablesService.deleteTable({ slug })
        res.json({
            status: 200,
            data: results
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}