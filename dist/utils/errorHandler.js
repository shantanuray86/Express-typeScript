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
Object.defineProperty(exports, "__esModule", { value: true });
const fsPromises = require('fs').promises;
// const errorHandler = (err, req, res, next) => {
//     var statusCode = err.statusCode || 500;
//    // logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
//     //console.error(err);
//     res.status(statusCode).send(err.message);
// next();
// }
function errorHandler(err, req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var statusCode = err.statusCode || 500;
        const logMsg = `${new Date()} - ${req.method} - ${req.url} - ${statusCode} - ${err.message} \n`;
        yield fsPromises.appendFile('errorLogger.log', logMsg);
        res.status(statusCode).send(err.message);
        next();
    });
}
//module.exports = errorHandler;
exports.default = errorHandler;
