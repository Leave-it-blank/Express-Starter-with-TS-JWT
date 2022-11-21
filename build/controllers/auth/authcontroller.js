"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// getting all posts
const weekly_flush = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get some posts
    // @ts-ignore
    const flush = "weekly-leaderboards";
    return res.status(200).json({
        message: "DONE"
    });
});
// getting a single post
const update_kills = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get the user id from the req
    const cached2 = "weekly-leaderboards";
    return res.status(200).json({
        message: cached2
    });
});
exports.default = { weekly_flush, update_kills };
