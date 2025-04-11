import express from "express";
const router = express.Router();
import * as demoRequestController from "../controllers/demoRequestController.js";
import auth from "../middlewares/authMiddleware.js";

router.post("/", demoRequestController.createDemoRequest);
router.get("/", auth('superadmin'), demoRequestController.getDemoRequests);
router.delete("/:id", auth('superadmin'), demoRequestController.deleteDemoRequest);

export default router;
