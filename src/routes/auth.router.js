import express from "express"
import dotenv from "dotenv"
import client from "../config/x.config.js"
dotenv.config()

const authRouter = express.Router()

authRouter.get("/", (req, res)=>{
    res.send("/auth routes")
})

authRouter.get("/token",async (req, res)=>{
    const { data: createdTweet } = await client.v2.tweet('twitter-api-v2 is awesome!', {
        poll: { duration_minutes: 120, options: ['Absolutely', 'For sure!'] },
      });
      console.log('Tweet', createdTweet.id, ':', createdTweet.text);
    res.json({
        createdTweet
    })
})



export default authRouter