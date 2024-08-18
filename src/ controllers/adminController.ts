import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

// Create or Update User Role
export const setUserRole = async (req: Request, res: Response) => {
  const { userId, role } = req.body;

  if (!Object.values(Role).includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    res.status(200).json({ message: "User role updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user role", error });
  }
};

// Get All Users with Roles
export const getAllUsersWithRoles = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Get Single User Role
export const getUserRole = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user role", error });
  }
};

// Delete User Role (or reset to default 'User' role)
export const deleteUserRole = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { role: Role.Subscriber },
    });

    res.status(200).json({ message: "User role reset to User", user });
  } catch (error) {
    res.status(500).json({ message: "Error resetting user role", error });
  }
};
