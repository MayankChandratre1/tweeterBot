import { connctDB } from "../config/db.config.js"

export const connectDBMiddleware = async (req, res, next) =>{
    try{
        await connctDB()
        next()
    }catch(err){
        console.log(err);
        return res.json({
            message:"Failed to connect to DB"
        })
    }
}