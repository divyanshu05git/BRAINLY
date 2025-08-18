
import  type { NextFunction,Request,Response } from "express";
import {JWT_SECRET} from "./config.js"
import jwt from "jsonwebtoken"


export const userMiddleware=async(req:Request ,res:Response ,next:NextFunction)=>{
    try {
        const token = req.headers["authorization"];
        if (!token) {
            return res.status(401).json({ message: "Authorization header missing" });
        }

        // verify and decode directly
        const decoded = jwt.verify(token as string, JWT_SECRET) 

        // @ts-ignore
        req.userId = decoded.id;

        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized user" });
    }
}