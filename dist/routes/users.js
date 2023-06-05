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
const router = require("express").Router();
//const User = require("../models/User");
const User_1 = __importDefault(require("../models/User"));
const bcrypt = require("bcrypt");
const checkUserAuth = require('../middlewares/auth-middleware');
//GET ALL USERS
router.get("/all-users", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = yield User_1.default.find();
            console.log("userts", user);
            res.status(200).json({ "response": user, "status": "success" });
        }
        catch (err) {
            res.status(500).json(err);
        }
    });
});
// //GET USER
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.params.id);
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
// //UPDATE
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body._id === req.params.id) {
        if (req.body.password) {
            const salt = yield bcrypt.genSalt(10);
            req.body.password = yield bcrypt.hash(req.body.password, salt);
        }
        try {
            const updatedUser = yield User_1.default.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true });
            res.status(200).json(updatedUser);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(401).json("You can update only your account!");
    }
}));
// //DELETE
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.params.id);
        try {
            yield User_1.default.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted...");
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    catch (err) {
        res.status(404).json("User not found!");
    }
}));
router.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const newUser = new User(req.body);
    try {
        // const savedUser = await newPost.save();
        const newBuffet = new User_1.default({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password
            // bankdetails: {
            //   accountno: req.body.accountno,
            //   type: req.body.accounttype,
            // },
        });
        const buffet = yield User_1.default.create();
        res.status(200).json(buffet);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
// User Login
// router.post('/login',async (req:Request, res:Response)=>{
//   try {
//     const user = await User.findOne({email:req.body.email})
//   } catch (error) {
//   }
// })
//module.exports = router;
exports.default = router;
