// src/routes/authRoutes.ts
import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  logout,
  resetPassword,
} from "../ controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout); // Route to logout and invalidate a refresh token
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
