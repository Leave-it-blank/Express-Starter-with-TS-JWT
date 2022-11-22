/** source/controllers/posts.ts */
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const Redis = require('ioredis');
const fs = require('fs');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt")


const accessTokenSecret = process.env.JWTSECRET;
const refreshTokenSecret = process.env.JWTREFRESH_SECRET;
const salt_env = process.env.SALT;

const salt = typeof (salt_env) === "string" ? salt_env : "saltafa1$@/wfaw"; // salt for hashing password

const ioredis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
});
async function cacheRefreshToken(refreshToken: String) {
    await ioredis.sadd("refreshTokens", refreshToken);
}
async function removeCacheAccessToken(refreshToken: String) {
    const d = await ioredis.srem("refreshTokens", refreshToken);

    return d;
}
async function checkCacheAccessToken(refreshToken: String) {
    return await ioredis.sismember("refreshTokens", refreshToken);
}
async function hashPassword(plaintextPassword: String) {
    const hash = await bcrypt.hash(plaintextPassword + salt, 10);
    return hash;
}
// compare password
async function comparePassword(plaintextPassword: String, hash: String) {
    const result = await bcrypt.compare(plaintextPassword + salt, hash);
    return result;
}
// getting all posts
const login = async (req: Request, res: Response, next: NextFunction) => {
    var verify = false;
    var data: any = {};
    data["name"] = req.body.username.toLowerCase();
    const prisma = new PrismaClient()
    async function main() {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                username: data["name"],
            },
        })
        verify = await comparePassword(req.body.password, user["password"]);
        if (verify) {
            const accessToken = jwt.sign({ username: user.username, role: user["role"] }, accessTokenSecret, { expiresIn: '20m' });
            const refreshToken = jwt.sign({ username: user.username, role: user["role"] }, refreshTokenSecret);
            cacheRefreshToken(refreshToken);

            return res.status(200).json({
                accessToken,
                refreshToken
            });
        }
        return res.status(404).json({
            message: "Wrong Credentials."
        });

    }
    main()
        .then(async () => {
            await prisma.$disconnect()
        })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })


};

const signup = async (req: Request, res: Response, next: NextFunction) => {
    var data: any = {};
    data["name"] = req.body.username.toLowerCase();
    data["email"] = req.body.email.toLowerCase();
    data["password"] = await hashPassword(req.body.password);
    data["api_key"] = crypto.randomBytes(20).toString('hex');
    const prisma = new PrismaClient()
    async function main() {
        const user = await prisma.user.create({
            data: {
                username: data["name"],
                email: data["email"],
                password: data["password"],
                api_key: data["api_key"]
            },
        })
    }

    main()
        .then(async () => {
            await prisma.$disconnect()
        })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })


    return res.status(200).json({
        message: "Registered"
    });
};


//@ts-ignore
const refreshToken = async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers['authorization'];
    //ts-ignore
    const token: String = typeof (authHeader) != "undefined" ? authHeader?.split(' ')[1] : "";
    if (!token) {
        return res.sendStatus(401);
    }
    if (!await checkCacheAccessToken(token)) {
        return res.sendStatus(403);
    }
    jwt.verify(token, refreshTokenSecret, (err: any, user: { username: String; role: String; }) => {
        if (err) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });

        return res.json({
            accessToken
        });
    });
}

//@ts-ignore
const logout = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers['authorization'];
    //ts-ignore
    const token: String = typeof (authHeader) != "undefined" ? authHeader.split(' ')[1] : "";
    removeCacheAccessToken(token);
    res.send("Logout successful");

}


export default { login, signup, refreshToken, logout }; 