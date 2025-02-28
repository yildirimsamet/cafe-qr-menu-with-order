import express from "express";
const router = express.Router();
import * as settingsController from "../controllers/settingsController.js";

router.get("/", settingsController.getSettings);

router.post("/update-logo", settingsController.upload.single('logo'), settingsController.updateLogoImage);

export default router;