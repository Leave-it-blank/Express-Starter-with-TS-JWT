/** source/controllers/example.ts */
import { Request, Response, NextFunction } from 'express';

const test1 = async (req: Request, res: Response, next: NextFunction) => {

    return res.status(200).json({
        message: "DONE test1"
    });
};

const test2 = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        message: "DONE test2"
    });
};

export default { test1, test2 };