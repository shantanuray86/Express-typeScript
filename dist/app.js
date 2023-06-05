"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const mongoose_1 = __importDefault(require("mongoose"));
const customer_1 = __importDefault(require("./routes/customer"));
const buffet_1 = __importDefault(require("./routes/buffet"));
const airport_1 = __importDefault(require("./routes/airport"));
const users_1 = __importDefault(require("./routes/users"));
const jwt_1 = __importDefault(require("./routes/jwt"));
const posts_1 = __importDefault(require("./routes/posts"));
const categories_1 = __importDefault(require("./routes/categories"));
const errorHandler_1 = __importDefault(require("./utils/errorHandler"));
const requestLogger_1 = __importDefault(require("./utils/requestLogger"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
app.use(express_1.default.json());
app.use(requestLogger_1.default);
app.use("/images", express_1.default.static(path_1.default.join(__dirname, "/images")));
app.use((0, cookie_parser_1.default)());
mongoose_1.default
    .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
})
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));
const storage = multer_1.default.diskStorage({
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
app.use((0, cors_1.default)({ origin: true, credentials: true }));
const upload = (0, multer_1.default)({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded");
});
app.use("/api/airport", airport_1.default);
app.use("/api/buffet", buffet_1.default);
app.use("/api/auth", auth_1.default);
app.use("/api/users", users_1.default);
app.use("/api/jwt", jwt_1.default);
app.use("/api/posts", posts_1.default);
app.use("/api/categories", categories_1.default);
app.use("/api/customer", customer_1.default);
app.use(errorHandler_1.default);
app.listen("5000", () => {
    console.log("Backend is running at Port 5000");
});
