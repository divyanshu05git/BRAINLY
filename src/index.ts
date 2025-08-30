
import express from "express";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import {z} from "zod";
import bcrypt from "bcrypt";
import {User,Content,Link,Tag} from "./db.js"
import {userMiddleware} from "./middleware.js"
import cors from "cors";
import { JWT_SECRET } from "./config";
import {random} from "./utils.js"


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

app.post("/api/v1/signin",async (req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    

    const user=await User.findOne({username});
    if(!user){
        res.status(403).json({
            message:"Invalid username and password"
        })
        return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        res.status(403).json({
            message:"Invalid username and password"
        })
    }

    try{
        //GENERATING A TOKEN
        const token=jwt.sign({id:user._id},JWT_SECRET);
        res.json({
            token:token
        })
    }
    catch(err){
        res.status(403).json({
            message:"error while signing in"
        })
    }
})

//working
app.post("/api/v1/content",userMiddleware,async (req,res)=>{
    const link=req.body.link;
    const type=req.body.type;
    const title=req.body.title

   

    try{
        
        const content =await Content.create({
            title,
            link,
            type,
            //@ts-ignore
            userId:req.userId,
            tags:[]
        })

        return res.json({
            message:"Content added"
        })
    }
    catch(err){
        res.status(400).json({
            message:"Can not add content"
        })
    }
})

app.get("/api/v1/content",userMiddleware,async (req,res)=>{
    //@ts-ignore
    const userId=req.userId;

    try{
        const content=await Content.find({
            userId:userId
        }).populate("userId","username")

        res.json({
            content
        })
    }
    catch(err){
        res.json({
            message:"can not find the contents ,try again "
        })
    }
})

app.delete("/api/v1/content",userMiddleware,async(req,res)=>{
    //@ts-ignore
    const userId=req.userId;
    const contentId=req.body.contentId;

    try{
    const del=await Content.deleteMany({
        userId,
        contentId
    })
    }
    catch(err){
        res.status(500).json({
            message:"Can not delete the content"
        })
    }
})

app.post("/api/v1/brain/share",userMiddleware,async (req,res)=>{
    const share = req.body.share;
    if (share) {
        // Check if a link already exists for the user.
        //@ts-ignore
        const existingLink = await Link.findOne({ userId: req.userId });
        if (existingLink) {
            res.json({ hash: existingLink.hash }); // Send existing hash if found.
            return;
        }

        // Generate a new hash for the shareable link.
        const hash = random(10);
        
        await Link.create({ 
            //@ts-ignore
            userId: req.userId,
            hash 
        });
        res.json({ hash }); // Send new hash in the response.
    } else {
        // Remove the shareable link if share is false.
        //@ts-ignore
        await Link.deleteOne({ userId: req.userId });
        res.json({ message: "Removed link" }); // Send success response.
    }
})

//get shared link
app.get("/api/v1/brain/:shareLink",async (req,res)=>{
    const hash = req.params.shareLink;

    // Find the link using the provided hash.
    const link = await Link.findOne({ hash });
    if (!link) {
        res.status(404).json({ message: "Invalid share link" }); // Send error if not found.
        return;
    }

    // Fetch content and user details for the shareable link.
    const content = await Content.find({ userId: link.userId });
    const user = await User.findOne({ _id: link.userId });

    if (!user) {
        res.status(404).json({ message: "User not found" }); // Handle missing user case.
        return;
    }

    res.json({
        username: user.username,
        content
    }); 
})


const PORT = process.env.PORT || 3000;

async function main(){
    try {
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log("Connected ");
        app.listen(PORT, () => console.log("Server running on port "+`${PORT}`));
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    }
}

main()