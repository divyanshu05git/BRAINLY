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
const middleware_js_1 = require("./middleware.js");
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const utils_js_1 = require("./utils.js");
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
        const token = jsonwebtoken_1.default.sign({ id: user._id }, config_1.JWT_SECRET);
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
app.post("/api/v1/content", middleware_js_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const link = req.body.link;
    const type = req.body.type;
    const title = req.body.title;
    console.log("everything is listed");
    try {
        console.log("before content addition");
        const content = yield db_js_1.Content.create({
            title,
            link,
            type,
            userId: req.userId,
            tags: []
        });
        console.log("after content addition");
        return res.json({
            message: "Content added"
        });
    }
    catch (err) {
        res.status(400).json({
            message: "Can not add content"
        });
    }
}));
app.get("/api/v1/content", middleware_js_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const content = yield db_js_1.Content.find({
            userId: userId
        }).populate("userId", "username");
        res.json({
            content
        });
    }
    catch (err) {
        res.json({
            message: "can not find the contents ,try again "
        });
    }
}));
app.delete("/api/v1/content", middleware_js_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const contentId = req.body.contentId;
    try {
        const del = yield db_js_1.Content.deleteMany({
            userId,
            contentId
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Can not delete the content"
        });
    }
}));
app.post("/api/v1/brain/share", middleware_js_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    if (share) {
        const existingLink = yield db_js_1.Link.findOne({ userId: req.userId });
        if (existingLink) {
            res.json({ hash: existingLink.hash });
            return;
        }
        const hash = (0, utils_js_1.random)(10);
        yield db_js_1.Link.create({
            userId: req.userId,
            hash
        });
        res.json({ hash });
    }
    else {
        yield db_js_1.Link.deleteOne({ userId: req.userId });
        res.json({ message: "Removed link" });
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield db_js_1.Link.findOne({ hash });
    if (!link) {
        res.status(404).json({ message: "Invalid share link" });
        return;
    }
    const content = yield db_js_1.Content.find({ userId: link.userId });
    const user = yield db_js_1.User.findOne({ _id: link.userId });
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json({
        username: user.username,
        content
    });
}));
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
