"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Link = exports.Content = exports.Tag = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { Types } = mongoose_1.default;
const contentTypes = ['image', 'video', 'article', 'audio'];
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const tagSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true, unique: true }
});
const contentSchema = new mongoose_1.default.Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    title: { type: String, required: true },
    tags: [{ type: Types.ObjectId, ref: "Tag" }],
    userId: { type: Types.ObjectId, ref: 'User', required: true }
});
const linkSchema = new mongoose_1.default.Schema({
    hash: { type: String, required: true, unique: true, index: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true }
});
const User = mongoose_1.default.model("User", userSchema);
exports.User = User;
const Tag = mongoose_1.default.model("Tag", tagSchema);
exports.Tag = Tag;
const Content = mongoose_1.default.model("Content", contentSchema);
exports.Content = Content;
const Link = mongoose_1.default.model('Link', linkSchema);
exports.Link = Link;
