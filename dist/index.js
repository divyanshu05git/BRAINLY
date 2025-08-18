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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_js_1 = require("./db.js");
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredBody = zod_1.z.object({
        username: zod_1.z.string(),
        password: zod_1.z.string().min(6)
    });
    const parsed = requiredBody.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            error: "Invalid inputs",
        });
    }
    const { username, password } = parsed.data;
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    try {
        yield db_js_1.User.create({
            username: username,
            password: hashedPassword
        });
        res.json({
            message: "account created"
        });
    }
    catch (err) {
        res.json({
            message: "error while signing up"
        });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const user = yield db_js_1.User.findOne({ username });
    if (!user) {
        res.status(403).json({
            message: "Invalid username and password"
        });
        return;
    }
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        res.status(403).json({
            message: "Invalid username and password"
        });
    }
    try {
        const token = jsonwebtoken_1.default.sign({ id: username._id }, config_1.JWT_SECRET);
        res.json({
            token: token
        });
    }
    catch (err) {
        res.status(403).json({
            message: "error while signing in"
        });
    }
}));
app.post("/api/v1/content", (req, res) => {
});
app.get("/api/v1/content", (req, res) => {
});
app.delete("/api/v1/content", (req, res) => {
});
app.get("/api/v1/brain/:shareLink", (req, res) => {
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(process.env.MONGO_URL);
            console.log("Connected ");
            app.listen(3000, () => console.log("Server running on port 3000"));
        }
        catch (err) {
            console.error("MongoDB connection failed:", err);
            process.exit(1);
        }
    });
}
main();
