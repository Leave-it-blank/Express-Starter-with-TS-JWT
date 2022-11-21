"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
/** source/routes/killcounter.ts */
// @ts-ignore
const express_1 = __importDefault(require("express"));
const killcounter_1 = __importDefault(require("../controllers/killcounter"));
const router = express_1.default.Router();
router.get('/flush_kills', killcounter_1.default.weekly_flush);
router.get('/kills/:name', killcounter_1.default.update_kills);
module.exports = router;
