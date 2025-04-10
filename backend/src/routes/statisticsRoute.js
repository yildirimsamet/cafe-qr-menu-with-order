import express from "express";
const router = express.Router();
import * as statisticsController from "../controllers/statisticsController.js";

router.post("/products-sell-count/:startDate/:endDate", statisticsController.getProductsSellCount);
router.get("/table-order-count/:startDate/:endDate", statisticsController.getTableOrderCount);
router.post("/orders/:startDate/:endDate", statisticsController.getOrders);

export default router;
