// src/utils/tokenBlacklist.ts
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const addToBlacklist = async (token: string) => {
  const decoded = jwt.decode(token) as jwt.JwtPayload;
  const expiresAt = decoded.exp ? new Date(decoded.exp * 1000) : new Date();

  await prisma.blacklistedToken.create({
    data: {
      token,
      expiresAt,
    },
  });
};

export const isTokenBlacklisted = async (token: string) => {
  const blacklistedToken = await prisma.blacklistedToken.findUnique({
    where: { token },
  });

  if (blacklistedToken) {
    // Optionally, check if token is expired
    const now = new Date();
    if (blacklistedToken.expiresAt < now) {
      // Optionally: Remove expired token from blacklist
      await prisma.blacklistedToken.delete({
        where: { token },
      });
      return false;
    }
    return true;
  }
  return false;
};
