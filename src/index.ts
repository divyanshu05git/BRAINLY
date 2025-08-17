
import express from "express";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import {z} from "zod";
import bcrypt from "bcrypt";
import {User,Content,Link,Tag} from "./db.js"
import {userMiddleware} from "./middleware.js"
import cors from "cors";
import { MONGO_URL } from "./config";

const app=express();
app.use(express.json());
app.use(cors())  // Middleware to allow cross-origin requests


app.post("/api/v1/signup",async (req,res)=>{
    const requiredBody=z.object({
        username: z.string(),
        password: z.string().min(6)
    })

    const parsed=requiredBody.safeParse(req.body);
    if(!parsed.success){
        return res.status(400).json({
            error: "Invalid inputs",
        })
    }

    const { username, password } = parsed.data;
    const hashedPassword=await bcrypt.hash(password,10);

    try{
        await User.create({
            username: username,
            password: hashedPassword
        })

        res.json({
            message: "account created"
        })
    }
    catch(err){
        res.json({
            message: "error while signing up"
        })
    }

})

app.post("/api/v1/signin",(req,res)=>{

})

app.post("/api/v1/content",(req,res)=>{

})

app.get("/api/v1/content",(req,res)=>{

})

app.delete("/api/v1/content",(req,res)=>{

})

app.get("/api/v1/brain/:shareLink",(req,res)=>{

})


// Start the server
async function main(){
    try {
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log("Connected ");
        app.listen(3000, () => console.log("Server running on port 3000"));
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    }
}

main()