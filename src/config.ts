export const JWT_SECRET="JUHRFUGJ3OT"

import dotenv from "dotenv";
dotenv.config();

export const MONGO_URL = process.env.MONGO_URL as string;
