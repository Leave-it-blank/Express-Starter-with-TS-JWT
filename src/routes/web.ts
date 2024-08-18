// src/routes/profileRoutes.ts
import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../ controllers/profileController";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { home } from "../ controllers/homeController";

const router = Router();

router.get("/profile", isAuthenticated, getUserProfile);

router.put("/profile", isAuthenticated, updateUserProfile);

router.get("/", home);
export default router;
