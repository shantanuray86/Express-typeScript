import express from "express";
const app = express();
import dotenv from "dotenv";
import authRoute from "./routes/auth";
import mongoose, { ConnectOptions } from "mongoose";

import userRoute from "./routes/users";
import jwt from "./routes/jwt";
import errorHandler from "./utils/errorHandler";
import myReqLogger from './utils/requestLogger';
import multer from "multer";
import path from "path";
import cors from 'cors';
import cookieParser from 'cookie-parser';


dotenv.config();
app.use(express.json());
app.use(myReqLogger);
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(cookieParser());
mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.log(err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

// const errorHandler = (err, req, res, next) => {
//   var statusCode = err.statusCode || 500;
//  // logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
//   //console.error(err);
  
//   res.status(statusCode).send(err.message);
// next();
// }
//app.use(cors());
app.use(cors({ origin: true, credentials: true }))
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/jwt", jwt);

app.use(errorHandler);
app.listen("5000", () => {
  console.log("Backend is running at Port 5000");
});

