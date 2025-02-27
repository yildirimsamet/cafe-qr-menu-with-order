import express from "express";
const router = express.Router();
import * as menuController from "../controllers/menuController.js";

router.get("/", menuController.getMenu);

export default router;