import * as itemsService from '../services/itemsService.js'
import multer from "multer"
import slugify from "slugify"
import path from "path"
import fs from "fs"

const uploadPath = "public/assets/images"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true })
        }
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const filename = slugify(path.basename(file.originalname, ext), { lower: true }) + Date.now() + ext
        cb(null, filename)
    }
})

const upload = multer({ storage })

export const getItems = async (req, res) => {
    try {
        const results = await itemsService.getItems()
        res.json({
            status: 200,
            data: results
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const addItem = async (req, res) => {
    const { name, description, category, sizes: sizesJson } = req.body
    const image = req.file ? req.file.filename : null


    let sizes
    try {
        sizes = sizesJson.map(item=>JSON.parse(item))
    } catch (error) {
        return res.status(400).json({ error: "Invalid sizes format" })
    }

    try {
        const results = await itemsService.addItem({ 
            name, 
            description, 
            category, 
            image, 
            sizes 
        })
        res.json({
            status: 200,
            data: results
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const deleteItem = async (req, res) => {
    const { id } = req.params

    try {
        const results = await itemsService.deleteItem({ id })
        res.json({
            status: 200,
            data: results
        })
    } catch (error) {
        if (error.message === "Item not found") {
            return res.status(404).json({ error: "Item not found" })
        }
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const editItem = async (req, res) => {
    const { id } = req.params
    const { name, description, category, sizes: sizesJson } = req.body

    let sizes
    try {
        sizes = sizesJson.map(item=>JSON.parse(item))
    } catch (error) {
        return res.status(400).json({ error: "Invalid sizes format" })
    }

    const image = req.file ? req.file.filename : null

    try {
        const results = await itemsService.editItem({ 
            id, 
            name, 
            description, 
            category, 
            image, 
            sizes 
        })
        res.json({
            status: 200,
            data: results
        })
    } catch (error) {
        if (error.message === "Item not found") {
            return res.status(404).json({ error: "Item not found" })
        }
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

export { upload }