"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
/** source/server.ts */
// @ts-ignore
const http_1 = __importDefault(require("http"));
// @ts-ignore
const express_1 = __importDefault(require("express"));
// @ts-ignore
const morgan_1 = __importDefault(require("morgan"));
// @ts-ignore
const killcounter_1 = __importDefault(require("./routes/killcounter"));
const cron = require('node-cron');
const fetch = require("node-fetch");
require('dotenv').config();
// @ts-ignore
const router = (0, express_1.default)();
/** Logging */
router.use((0, morgan_1.default)('dev'));
/** Parse the request */
router.use(express_1.default.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express_1.default.json());
/** @ts-ignore RULES OF OUR API  */
router.use((req, res, next) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({});
    }
    next();
});
/** Routes */
router.use('/', killcounter_1.default);
/**@ts-ignore Error handling */
router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});
/** Server */
const httpServer = http_1.default.createServer(router);
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 6060;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
//@ts-ignore
// cron.schedule('0 8 * * 1',
//     () => {  fetch('http://localhost:6060/flush_kills').then(() =>{
//             console.log("Task is running every monday 8 am " + new Date())
//     });
//         console.log("LeaderBoard is Wiped Now  " + new Date());
//     });
