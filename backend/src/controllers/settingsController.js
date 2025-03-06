import * as settingsService from '../services/settingsService.js';
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

export const getSettings = async (req, res) => {
    try {
        const settings = await settingsService.getSettings();
        res.json({
            status: 200,
            data: settings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateLogoImage = async (req, res) => {
    if (req?.user?.role !== 'superadmin') {
        return res.status(403).json({ error: "Forbidden: insufficient role" })
    }

    try {
        const logo = req.file ? req.file.filename : null;
        const results = await settingsService.updateLogoImage(logo);
        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateColors = async (req, res) => {
    if (req?.user?.role !== 'superadmin') {
        return res.status(403).json({ error: "Forbidden: insufficient role" })
    }

    let { colors } = req.body;

    if (typeof colors !== 'string') {
        colors = JSON.stringify(colors);
    }

    try {
        const results = await settingsService.updateColors(colors);
        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateContactInfo = async (req, res) => {
    if (req?.user?.role !== 'superadmin') {
        return res.status(403).json({ error: "Forbidden: insufficient role" })
    }

    try {
        const results = await settingsService.updateContactInfo(req.body);
        res.json({ status: 200, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export { upload }

