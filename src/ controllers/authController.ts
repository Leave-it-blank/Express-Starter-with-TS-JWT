// src/controllers/authController.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  addUser,
  findUserByEmail,
  resetPasswordByToken,
  resetPasswordLink,
} from "../models/User";
import { addToBlacklist } from "../utils/tokenBlacklist";
import { Role } from "@prisma/client";
import { sendResetPasswordEmail } from "../utils/email";
import { randomBytes } from "crypto";

const jwtSecret = process.env.JWT_SECRET || "your-secret-key";

const generateTokens = (user: { id: number; email: string; role: Role }) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: Role },
    jwtSecret,
    {
      expiresIn: "2d",
    }
  );

  return { accessToken };
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  if (!username || !password || !email) {
    res.status(400).json({
      message: "Bad Request, Missing fields",
    });
  }

  if (await findUserByEmail(email)) {
    res.status(400).json({ message: "Email already exists" });
    return;
  }

  const user = await addUser(username, email, password);
  const tokens = generateTokens(user);

  res.json(tokens);
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(400).json({ message: "Invalid email or password" });
    return;
  }

  const tokens = generateTokens(user);

  res.json(tokens);
};

export const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null)
    return res.status(401).json({ message: "No token provided" });

  await addToBlacklist(token); // Add token to blacklist in Prisma
  res.status(200).json({ message: "Logged out successfully" });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await findUserByEmail(email);

  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate a password reset token
  const token = randomBytes(32).toString("hex");

  await resetPasswordLink(token, user);
  // Send the reset email
  await sendResetPasswordEmail(email, token);

  res.status(200).json({ message: "Password reset link sent" });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  const result = await resetPasswordByToken(token, newPassword);

  res.status(200).json({ ...result });
};
