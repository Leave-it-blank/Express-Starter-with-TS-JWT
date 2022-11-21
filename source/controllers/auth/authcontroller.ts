/** source/controllers/posts.ts */
import { doesNotMatch } from 'assert';
import { Request, Response, NextFunction } from 'express';
const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'yourrefreshtokensecrethere';
let refreshTokens: any[] = [];
//ts-ignore
import { PrismaClient } from '@prisma/client';
const jwt = require("jsonwebtoken");
var crypto = require("crypto");
const bcrypt = require("bcrypt")
var salt = "a0we221q3$@#dad#"   // salt for hashing password
async function hashPassword(plaintextPassword: any) {
    const hash = await bcrypt.hash(plaintextPassword + salt, 10);
    return hash;
}
// compare password
async function comparePassword(plaintextPassword: any, hash: any) {
    const result = await bcrypt.compare(plaintextPassword + salt, hash);
    return result;
}
// getting all posts
const login = async (req: Request, res: Response, next: NextFunction) => {
    var found = false, verify = false;
    var data: any = {};
    data["name"] = req.body.username.toLowerCase();
    const prisma = new PrismaClient()
    async function main() {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                username: data["name"],
            },
        })
        console.log(user)
        verify = await comparePassword(req.body.password, user["password"]);
        //console.log(verify + "verify");

        if (verify) {
            const accessToken = jwt.sign({ username: user.username, api: user["api_key"] }, accessTokenSecret, { expiresIn: '20m' });
            const refreshToken = jwt.sign({ username: user.username, api: user["api_key"] }, refreshTokenSecret);

            refreshTokens.push(refreshToken);
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
    //console.log(req.body);
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
        //console.log(user)
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
const refreshToken = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers['authorization'];
    //ts-ignore
    const token: String = typeof (authHeader) != "undefined" ? authHeader?.split(' ')[1] : "";
    console.log(typeof (token))

    if (!token) {
        return res.sendStatus(401);
    }
    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }

    jwt.verify(token, refreshTokenSecret, (err: any, user: { username: any; role: any; }) => {
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

    const token: String = typeof (authHeader) != "undefined" ? authHeader?.split(' ')[1] : "";
    console.log(typeof (token))
    console.log(token);
    refreshTokens.splice(refreshTokens.indexOf(token), 1); // remove token from array
    console.log(refreshTokens);

    console.log(refreshTokens);
    res.send("Logout successful");
}


export default { login, signup, refreshToken, logout }; 