const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const checkUserAuth = require('../middlewares/auth-middleware');
import { Request, Response } from "express";


//GET ALL USERS

router.get("/all-users",checkUserAuth, async (req:Request, res:Response) => {
  let user;
  try {
    user = await User.find();

    res.status(200).json({"response":user,"status":"success"});
  } catch (err) {
    res.status(500).json(err);
  }
});


// //GET USER
router.get("/:id", async (req:Request, res:Response) => {
  try {
    const user = await User.findById(req.params.id);
    const {...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //UPDATE
router.put("/:id", async (req:Request, res:Response) => {
  console.log(req.body);
  if (req.body._id === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You can update only your account!");
  }
});

// //DELETE
 router.delete("/:id", async (req:Request, res:Response) => {

    try {
      const user = await User.findById(req.params.id);
      try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      res.status(404).json("User not found!");
    }

});


router.post("/add", async (req:Request, res:Response) => {
  //const newUser = new User(req.body);
  try {
   // const savedUser = await newPost.save();
   const newBuffet = new User({
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
  const buffet = await User.save();
    res.status(200).json(buffet);
  } catch (err) {
    res.status(500).json(err);
  }
});


// User Login

router.post('/login',async (req:Request, res:Response)=>{
  try {
    const user = await User.findOne({email:req.body.email})
  } catch (error) {
    
  }
})

//module.exports = router;
export default router;
