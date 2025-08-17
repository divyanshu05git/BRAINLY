
import  type { NextFunction,Request,Response } from "express";
import {JWT_SECRET} from "./config.js"
import jwt from "jsonwebtoken"


export const userMiddleware=async(req:Request ,res:Response ,next:NextFunction)=>{
    const header=req.headers["authorization"];

    //verifying the JWT token
    const token=jwt.verify(header as string,JWT_SECRET);

    if(token){
        //@ts-ignore
        req.userId=decoded.id;
        next();
    }
    else{
        res.status(401).json({
            messagr:"Unauthorized user"
        })
    }
}