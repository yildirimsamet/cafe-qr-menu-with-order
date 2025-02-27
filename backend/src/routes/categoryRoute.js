import express from "express";
const router = express.Router();
import * as categoryController from "../controllers/categoryController.js";

router.get("/", categoryController.getCategories);

router.put("/:id", categoryController.editCategory);

router.post("/", categoryController.addCategory);

router.delete("/:id", categoryController.deleteCategory);

export default router;