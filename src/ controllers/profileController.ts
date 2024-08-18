// src/controllers/profileController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get User Profile
export const getUserProfile = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile data", error });
  }
};

// Update User Profile
export const updateUserProfile = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { username, email } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        email,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};
