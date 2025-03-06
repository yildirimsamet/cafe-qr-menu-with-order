import express from "express";
const router = express.Router();
import * as settingsController from "../controllers/settingsController.js";

router.get("/", settingsController.getSettings);

router.post("/update-logo", settingsController.upload.single('logo'), settingsController.updateLogoImage);

router.put('/colors', settingsController.updateColors);

router.put('/contact-info', settingsController.updateContactInfo);

export default router;