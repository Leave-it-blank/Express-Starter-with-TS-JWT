/** source/controllers/example.ts */
import { Request, Response, NextFunction } from 'express';

const test1 = async (req: Request, res: Response, next: NextFunction) => {



    return res.status(200).json({
        message: "test1"
    });
};

const test2 = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        message: "DONE test2"
    });
};

const fail1 = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(402).json({
        message: "fail 1"
    });
};

const fail2 = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(502).json({
        message: "fail 2"
    });
};
export default { test1, test2, fail1, fail2 };