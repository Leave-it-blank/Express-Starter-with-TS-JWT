import { Request, Response } from "express";

export const home = (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the API",
    status: "success",
    data: null,
  });
};
