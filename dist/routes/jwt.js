"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express = __importStar(require("express"));
let router = express.Router();
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth-middleware"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//REGISTER
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /* Check the password */
        // console.log(req.body.firstname);
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPass = yield bcrypt_1.default.hash(req.body.password, salt);
        const newUser = new User_1.default({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPass,
            phone: req.body.phone
        });
        const user = yield newUser.save();
        const accessToken = jsonwebtoken_1.default.sign({ "email": user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
        const refreshToken = jsonwebtoken_1.default.sign({ "username": user.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', secure: false, maxAge: 24 * 60 * 60 * 1000 });
        //res.json(user );
        res.status(200).json({ accessToken, user });
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
// const User = require('../models/User')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
// @desc Login
// @route POST /auth
// @access Public
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const foundUser = yield User_1.default.findOne({ email }).exec();
    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized!!!!!!' });
    }
    const match = yield bcrypt_1.default.compare(password, foundUser.password);
    if (!match)
        return res.status(401).json({ message: 'Unauthorized' });
    const accessToken = jsonwebtoken_1.default.sign({
        "UserInfo": {
            "email": foundUser.email
            // "roles": foundUser.roles
        }
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
    const refreshToken = jsonwebtoken_1.default.sign({ "email": foundUser.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    });
    // Send accessToken containing username and roles 
    res.json({ accessToken });
}));
// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
router.post("/refresh", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    console.log(req.cookies);
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
        return res.status(401).json({ message: 'Unauthorized!!!!!' });
    const refreshToken = cookies.jwt;
    jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(403).json({ message: 'Forbidden' });
        let foundUser = {};
        foundUser = yield User_1.default.findOne({ username: decoded.username }).exec();
        if (!foundUser)
            return res.status(401).json({ message: 'Unauthorized' });
        const accessToken = jsonwebtoken_1.default.sign({
            "UserInfo": {
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        res.json({ accessToken });
    }));
}));
// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
router.post("/refresh", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
        return res.sendStatus(204); //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: false });
    res.json({ message: 'Cookie cleared' });
}));
router.get("/checkoutauth", auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ "hello": req.body.user });
}));
router.get("/checktokenvalidity", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization.split(' ')[1];
    let email;
    // Verify Token
    console.log(token);
    console.log(process.env.ACCESS_TOKEN_SECRET);
    email = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET));
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(403).json({ message: 'Forbidden' });
        const foundUser = yield User_1.default.findOne({ email: decoded.email }).exec();
        if (!foundUser)
            return res.status(401).json({ message: 'Unauthorized' });
        res.json({ 'status': 200, 'message': 'authorized' });
    }));
}));
exports.default = router;
