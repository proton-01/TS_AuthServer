import express from "express";
import { authController } from "../controllers";

const router = express.Router();

router.post("/api/auth/register", authController.registerUser);
router.post("/api/auth/login", authController.loginUser);
router.post("/api/auth/refresh", authController.refresh);

export { router as authRouter };