import express from "express";
const router = express.Router();
import * as sizeController from "../controllers/sizeController.js";

router.get("/", sizeController.getSizes);

router.post("/", sizeController.addSize);

router.delete("/:id", sizeController.deleteSize);

router.put("/:id", sizeController.editSize);

export default router;