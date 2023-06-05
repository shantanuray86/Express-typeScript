import * as express from "express";
let router = express.Router();

import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import checkUserAuth from "../middlewares/auth-middleware";
import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
//REGISTER
router.post("/register", async (req:Request, res:Response) => {
    try {
      /* Check the password */
    // console.log(req.body.firstname);
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(req.body.password, salt);
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPass,
        phone:req.body.phone
      });
  
      const user = await newUser.save();
       
        const accessToken = jwt.sign(
            { "email": user.email },
            process.env.ACCESS_TOKEN_SECRET  as string,
            { expiresIn: '1d' }
        );
        const refreshToken = jwt.sign(
            { "username": user.email },
            process.env.REFRESH_TOKEN_SECRET  as string,
            { expiresIn: '1d' }
        );
         res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', secure: false, maxAge: 24 * 60 * 60 * 1000 });
     //res.json(user );
        res.status(200).json({accessToken,user});
    } catch (err) {
      res.status(500).json(err);
    }
});



// const User = require('../models/User')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')

// @desc Login
// @route POST /auth
// @access Public

router.post("/login", async (req:Request, res:Response) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ email }).exec()

    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized!!!!!!' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "email": foundUser.email
                // "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET  as string,
        { expiresIn: '15s' }
    )

    const refreshToken = jwt.sign(
        { "email": foundUser.email },
        process.env.REFRESH_TOKEN_SECRET  as string,
        { expiresIn: '1d' }
    )

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: false, //https true 
        sameSite: 'none' , //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    // Send accessToken containing username and roles 
    res.json({ accessToken })
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired

router.post("/refresh", async (req:Request, res:Response) => {
    const cookies = req.cookies;
    console.log(req.cookies);
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized!!!!!' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET  as string,
        async (err:any, decoded:any) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            let foundUser: any = {};
            foundUser = await User.findOne({ username: decoded.username }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET  as string,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        }
    )
});

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists

router.post("/refresh", async (req:Request, res:Response) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: false })
    res.json({ message: 'Cookie cleared' })
});

router.get("/checkoutauth", checkUserAuth, async(req:Request, res:Response)=>{
    
    res.json({"hello":req.body.user});
});

router.get("/checktokenvalidity", async(req:Request, res:Response)=>{
   
    const token = (req.headers.authorization as string).split(' ')[1]
    let email:any;
    // Verify Token
    console.log(token);
    console.log(process.env.ACCESS_TOKEN_SECRET  as string);
    email = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET  as string)
    console.log(jwt.verify(token, process.env.ACCESS_TOKEN_SECRET  as string));
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET  as string,
        async (err:any, decoded:any) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ email: decoded.email }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            res.json({ 'status':200, 'message':'authorized' })
        }
    )
})



export default router;