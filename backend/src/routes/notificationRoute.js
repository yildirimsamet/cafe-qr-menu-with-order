import express from "express";
const router = express.Router();
import * as notificationController from "../controllers/notificationController.js";

router.post("/", notificationController.createNotification);
router.get("/", notificationController.getAllNotifications);
router.delete("/:id", notificationController.deleteNotification);

export default router;
