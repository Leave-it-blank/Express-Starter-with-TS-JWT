/** source/controllers/posts.ts */
import { doesNotMatch } from 'assert';
import { Request, Response, NextFunction } from 'express';
const bcrypt = require("bcrypt")
var user: any[] = [];
var salt = "a0we221q3$@#dad#"   // salt for hashing password
var user_api = {};
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
    var user_data: any = [];
    console.log(user);
    var data: any = {};
    console.log(req.body);

    data["name"] = req.body.username.toLowerCase();

    user.forEach((element: any) => {
        if (element[0] == data["name"]) {
            console.log(element);
            console.log(data["name"]);
            found = true;
            user_data = element;
            console.log(user_data[2]);
        }
    });
    if (found) {
        verify = await comparePassword(req.body.password, user_data[2]);
        console.log(verify);

    }
    if (verify) {

        return res.status(200).json({
            message: "Logged in"
        });
    }
    return res.status(404).json({
        message: "User Not Found"
    });
};

const signup = async (req: Request, res: Response, next: NextFunction) => {

    var data: any = {};
    console.log(req.body);

    data["name"] = req.body.username.toLowerCase();
    data["email"] = req.body.email.toLowerCase();
    data["password"] = await hashPassword(req.body.password);
    console.log(data);

    user.push([data["name"], data["email"], data["password"]]);
    console.log(user);

    return res.status(200).json({
        message: "Registered"
    });
};

export default { login, signup };