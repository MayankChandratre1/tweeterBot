import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

export const connctDB = async (params) => {
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to mongodb");
    }catch(err){
        console.log(err);
        process.exit(0)
    }
}