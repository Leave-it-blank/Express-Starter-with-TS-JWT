/** source/server.ts */
// @ts-ignore
import http from "http";
// @ts-ignore
import express, { Express } from "express";
// @ts-ignore
import morgan from "morgan";
import { isAwaitExpression } from "typescript";
import { watchFile } from "fs";
const cron = require("node-cron");
const fetch = require("node-fetch");
require("dotenv").config();
// @ts-ignore

const router: Express = express();

/** Logging */
router.use(morgan("dev"));
/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

/** @ts-ignore RULES OF OUR API  */
router.use((req, res, next) => {
    // set the CORS policy
    res.header("Access-Control-Allow-Origin", "*");
    // set the CORS headers
    res.header(
        "Access-Control-Allow-Headers",
        "origin, X-Requested-With,Content-Type,Accept, Authorization"
    );
    // set the CORS method headers
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
        return res.status(200).json({});
    }
    next();
});

/** Routes */
var routes: string[] = [];
var fs = require('fs');

fs.readdirSync(__dirname + '/routes').forEach(function (file: string) {
    if (file.substr(file.lastIndexOf('.') + 1) === 'ts') {
        var name = file.substr(0, file.indexOf('.'));
        routes.push(name);
    }
});
console.log("Current Routes Controllers are: " + routes);

routes.forEach((route) => {
    router.use(require("./routes/" + route));
});




/**@ts-ignore Error handling */
router.use((req, res, next) => {
    const error = new Error("not found");
    return res.status(404).json({
        message: error.message,
    });
});

/** Server */
const httpServer = http.createServer(router);

const PORT: any = process.env.PORT ?? 6060;
httpServer.listen(PORT, () =>
    console.log(`The server is running on port ${PORT}`)
);
//@ts-ignore

// cron.schedule('0 8 * * 1',
//     () => {  fetch('http://localhost:6060/flush_kills').then(() =>{
//             console.log("Task is running every monday 8 am " + new Date())
//     });
//         console.log("LeaderBoard is Wiped Now  " + new Date());
//     });
