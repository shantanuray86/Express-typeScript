const jwt = require('jsonwebtoken');
const UserModel = require("../models/User");
import { Request, Response,NextFunction } from "express";

var checkUserAuth = async (req:Request, res:Response, next:NextFunction) => {
 // console.log(req);
  let token
  const { authorization } = req.headers
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // Get Token from header
      token = authorization.split(' ')[1]

      // Verify Token
      const { email } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      console.log(email);
      // Get User from Token
      req.body.user = await UserModel.find({email:email}).select('password')

      next()
    } catch (error) {
      console.log(error)
      res.status(401).send({ "status": "failed!!!!", "message": "Unauthorized User" })
    }
  }
  if (!token) {
    res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
  }
}

module.exports = checkUserAuth;