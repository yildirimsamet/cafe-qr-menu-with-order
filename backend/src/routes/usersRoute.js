import express from "express";
const router = express.Router();
import * as usersController from "../controllers/usersController.js";

router.get("/", usersController.getUsers);

router.get("/:id", usersController.getUserById);

export default router;
