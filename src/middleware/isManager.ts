import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";

export const isManager = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user?.role === Role.Manager || user?.role === Role.Admin) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Managers only." });
  }
};
