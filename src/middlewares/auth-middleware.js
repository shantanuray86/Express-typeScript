const jwt = require('jsonwebtoken');
const UserModel = require("../models/User");

var checkUserAuth = async (req, res, next) => {
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
      req.user = await UserModel.find({email:email}).select('password')

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

//export default checkUserAuth
module.exports = checkUserAuth;