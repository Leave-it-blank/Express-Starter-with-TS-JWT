// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { isTokenBlacklisted } from "../utils/tokenBlacklist";

const jwtSecret = process.env.JWT_SECRET || "your-secret-key";

interface JwtPayload {
  id: number;
  email: string;
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.status(401).json({ message: "Unauthorized" });
  if (await isTokenBlacklisted(token))
    return res.status(403).json({ message: "Token has been revoked" });

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    req.user = decoded; // Attach user information to the request object
    next();
  } catch {
    res.status(403).json({ message: "Unauthorized" });
  }
};
