import express from "express";
const router = express.Router();
import * as itemsController from '../controllers/itemsController.js'

router.get('/', itemsController.getItems);

router.post('/add',itemsController.upload.single('image'), itemsController.addItem);

router.delete('/delete/:id', itemsController.deleteItem);

router.put('/edit/:id', itemsController.upload.single('image'), itemsController.editItem);

router.put('/change-stock-status/:id', itemsController.changeStockStatus);

export default router;