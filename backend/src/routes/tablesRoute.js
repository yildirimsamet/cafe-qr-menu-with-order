import express from "express";
const router = express.Router();
import * as tablesController from "../controllers/tablesController.js";

router.get("/", tablesController.getTables);

router.get("/:slug", tablesController.getTable);

router.post("/", tablesController.addTable);

router.delete("/:slug", tablesController.deleteTable);

export default router;