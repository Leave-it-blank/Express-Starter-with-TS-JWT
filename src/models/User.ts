// src/models/userModel.ts
import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const addUser = async (
  username: string,
  email: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const resetPasswordLink = async (token: string, user: User) => {
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

  // Store the token in the database
  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });
};

export const resetPasswordByToken = async (
  token: string,
  newPassword: string
) => {
  // Verify the token
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return { message: "Invalid or expired token", success: false };
  }

  // Update the user's password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword },
  });

  // Delete the used token
  await prisma.passwordResetToken.delete({
    where: { token },
  });
  return { message: "successfully reset", success: true };
};
