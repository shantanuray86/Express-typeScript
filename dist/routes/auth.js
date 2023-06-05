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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
//REGISTER
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /* Check the password */
        console.log(req.body.firstname);
        const salt = yield bcrypt.genSalt(10);
        const hashedPass = yield bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPass,
        });
        const user = yield newUser.save();
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//LOGIN
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findOne({ username: req.body.username });
        !user && res.status(400).json("Wrong credentials!");
        const validated = yield bcrypt.compare(req.body.password, user.password);
        !validated && res.status(400).json("Wrong credentials!");
        const _a = user._doc, { password } = _a, others = __rest(_a, ["password"]);
        res.status(200).json(others);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//module.exports = router;
exports.default = router;
