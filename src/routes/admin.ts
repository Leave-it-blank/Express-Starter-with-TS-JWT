import { Router } from "express";
import {
  setUserRole,
  getAllUsersWithRoles,
  getUserRole,
  deleteUserRole,
} from "../ controllers/adminController";
import { isAdmin } from "../middleware/isAdmin";

const router = Router();

// Set or Update User Role
router.post("/role", isAdmin, setUserRole);

// Get All Users with Roles
router.get("/roles", isAdmin, getAllUsersWithRoles);

// Get Single User Role
router.get("/role/:userId", isAdmin, getUserRole);

// Delete User Role (reset to default role)
router.delete("/role/:userId", isAdmin, deleteUserRole);

export default router;
