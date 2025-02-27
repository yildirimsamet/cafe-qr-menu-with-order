import * as sizeService from '../services/sizeService.js'

export const getSizes = async (req, res) => {
    try {
        const results = await sizeService.getSizes()
        res.json({
            status: 200,
            data: results
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const addSize = async (req, res) => {
    const { name } = req.body

    try {
        const results = await sizeService.addSize({ name })
        res.json({
            status: 200,
            data: results
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const deleteSize = async (req, res) => {
    const { id } = req.params

    try {
        const results = await sizeService.deleteSize({ id })
        res.json({
            status: 200,
            data: results
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const editSize = async (req, res) => {
    const { id } = req.params
    const { name } = req.body

    try {
        const results = await sizeService.editSize({ id, name })
        res.json({
            status: 200,
            data: results
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}