import express from "express";
const router = express.Router();
import * as authController from "../controllers/authController.js";

router.post("/login", authController.login);

router.post("/register", authController.register);

router.put("/update/:id", authController.updateUser);

router.delete("/delete/:id", authController.deleteUser);

router.post("/user", authController.getUser);


export default router;