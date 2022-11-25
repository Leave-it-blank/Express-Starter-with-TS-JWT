/** @ts-ignore source/server.ts */
import express, { Express } from "express";
import http from "http";
import morgan from "morgan";
require("dotenv").config();
const helmet = require("helmet");
const cors = require('cors')
const rt = require("file-stream-rotator")
// @ts-ignore
const fs = require('fs');

const router: Express = express();
//security headers 
router.use(helmet());
//cross orgin resource sharing
router.use(cors());
/** Logging */
router.use(morgan("dev"));
let fileWriter = rt.getStream({
    filename: "errors.log",
    frequency: "daily",
    verbose: true
});

const skipSuccess = (req: any, res: { statusCode: number; }) => res.statusCode < 400;
// Error logging
router.use(morgan('combined', {
    skip: skipSuccess,
    stream: fileWriter
}))

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

/**Load Routes */
var routes: string[] = [];

fs.readdirSync(__dirname + '/routes').forEach(function (file: string) {
    if (file.substr(file.lastIndexOf('.') + 1) === 'ts') {
        var name = file.substr(0, file.indexOf('.'));
        routes.push(name);
        return;
    }
    var stat = fs.lstatSync(__dirname + '/routes' + '/' + file);
    if (stat.isDirectory()) {
        fs.readdirSync(__dirname + '/routes/' + file).forEach(function (file_2: string) {
            if (file_2.substr(file_2.lastIndexOf('.') + 1) === 'ts') {
                var name = file_2.substr(0, file_2.indexOf('.'));
                routes.push(file + "/" + name);
            }
        });
    }
});

console.log("Current Routes Controllers are: " + routes);

routes.forEach((route) => {
    router.use(require("./routes/" + route));
});

/**Error handling */
router.use((req, res, next) => {
    const error = new Error("not found");
    return res.status(404).json({
        message: error.message,
    });
});

/** Server */
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 3000;
httpServer.listen(PORT, () =>
    console.log(`The server is running on port ${PORT}`)
);

/** Cron Jobs */
//@ts-ignore
//const cron = require("node-cron");
//const fetch = require("node-fetch");
// cron.schedule('0 8 * * 1',
//     () => {  fetch('http://localhost:3000/test1').then(() =>{
//             console.log("Task is running every monday 8 am " + new Date())
//     });
//         console.log(new Date());
//     });
