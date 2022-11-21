/** source/controllers/posts.ts */
import { doesNotMatch } from 'assert';
import { Request, Response, NextFunction } from 'express';
//ts-ignore
import { PrismaClient } from '@prisma/client';
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

            return res.status(200).json({
                message: "Logged in!"
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

export default { login, signup };