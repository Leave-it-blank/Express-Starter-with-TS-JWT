/** source/controllers/posts.ts */
import { Request, Response, NextFunction } from 'express';
interface Player {
    name: String;
}

// getting all posts
const weekly_flush = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    // @ts-ignore
    const flush = "weekly-leaderboards";

    return res.status(200).json({
        message: "DONE"
    });
};

// getting a single post
const update_kills = async (req: Request, res: Response, next: NextFunction) => {
    // get the user id from the req


    const cached2 = "weekly-leaderboards";
    return res.status(200).json({
        message: cached2
    });
};

export default { weekly_flush, update_kills };