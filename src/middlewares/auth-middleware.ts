
import UserModel from "../models/User";
import { Request, Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

var checkUserAuth = async (req:Request, res:Response, next:NextFunction) => {
 // console.log(req);
  let token
  const { authorization } = req.headers
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // Get Token from header
      token = authorization.split(' ')[1]

      // Verify Token
      interface JwtPayload {
        email: string
      }
      let  {email} =jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
      console.log(email);
      // Get User from Token
      req.body.user = await UserModel.findOne({email:email}).select('password')

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
export default checkUserAuth;