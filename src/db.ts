import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const { Types } = mongoose;

const contentTypes=['image' , 'video' , 'article' , 'audio']

const userSchema=new mongoose.Schema({
    username: {type:String, required:true, unique:true},
    password: {type:String, required:true}
})

const tagSchema=new mongoose.Schema({
    title: {type:String, required:true, unique:true}
})

const contentSchema=new mongoose.Schema({
    link:  {type:String, required:true },
    type:  {type:String ,required:true},
    title: {type:String, required:true},
    tags:  [{type:Types.ObjectId, ref:"Tag"}],
    userId:{type:Types.ObjectId, ref:'User', required:true}
})

const linkSchema=new mongoose.Schema({
    hash: {type:String, required:true , unique:true, index:true},
    userId: {type:Types.ObjectId, ref:'User', required:true}
})

const User = mongoose.model("User", userSchema);
const Tag = mongoose.model("Tag", tagSchema);
const Content = mongoose.model("Content", contentSchema);
const Link = mongoose.model('Link',linkSchema);


export {User,Tag,Content,Link};