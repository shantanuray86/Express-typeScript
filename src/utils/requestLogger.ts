const fs = require('fs');

const {promisify}= require('util');
const appendFile = promisify(fs.appendFile);
import { Request, Response,NextFunction } from "express";

// async function requestLogger(req, res, next){
//     try {
//         const logMsg = `${new Date()} - ${req.method} - ${req.url} \n`;
//         await appendFile('RequestLogger.log', logMsg);
//         next();
//     } catch (error) {
//         next(error);
        
//     }
// }
const fsPromises = require('fs').promises;
async function requestLogger(req:Request, res:Response, next:NextFunction){
    try {
        const logMsg = `${new Date()} - ${req.method} - ${req.url} \n`;
        await fsPromises.appendFile('RequestLoggertwo.log', logMsg);
        next();
    } catch (error) {
        next(error);
        
    }
}

//module.exports = requestLogger;
export default requestLogger;