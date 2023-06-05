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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var checkUserAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req);
    let token;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            // Get Token from header
            token = authorization.split(' ')[1];
            let { email } = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
            console.log(email);
            // Get User from Token
            req.body.user = yield User_1.default.findOne({ email: email }).select('password');
            next();
        }
        catch (error) {
            console.log(error);
            res.status(401).send({ "status": "failed!!!!", "message": "Unauthorized User" });
        }
    }
    if (!token) {
        res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" });
    }
});
exports.default = checkUserAuth;
