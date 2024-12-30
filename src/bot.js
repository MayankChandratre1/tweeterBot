import dotenv from 'dotenv';
import express from 'express';
import generateTweet from './config/gemini.config.js';
import authRouter from "./routes/auth.router.js"
import client, { getTweetCount, makeRandomTweet, TWEET_URL } from './config/x.config.js';
import User from './model/user.model.js';
import axios from 'axios';
import start from "./services/cron.service.js"
import { connectDBMiddleware } from './middleware/db.middleware.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(connectDBMiddleware)



app.get('/', (_, res) => {
    res.send({
        message:`Total Tweets made ${getTweetCount()}`
    });
});



app.use("/auth", authRouter);


app.get('/callback', async (req, res) => {
    const {state, code} = req.query
    const user = await User.find()
    const {codeVerifier, state:sessionState} = user[0]
    user[0].set({
        accessToken:code
    })
    await user[0].save()
    if(!codeVerifier || !sessionState || !state){
        return res.status(401).send("Invalid request")
    }
    if(state != sessionState){
        return res.status(403).send("Expired Session")
    }

    client.loginWithOAuth2({ code, codeVerifier, redirectUri: process.env.REDIRECT_URI })
    .then(async ({ client: loggedClient, accessToken, refreshToken, expiresIn }) => {
      user[0].set({
        accessToken,
        refreshToken,
        expiresIn
      })
      await user[0].save()
      const { data: userObject } = await loggedClient.v2.me();
      console.log(userObject);
      res.json({message: "Callback Recieved", success: true, url: req.url, state, code});
    })
    .catch((error) =>{
        console.log(error);
        
        res.status(403).send('Invalid verifier or access tokens!')
    })
    
});

app.post("/randomtweet", async (req, res)=>{
    try{
        const {passkey} = req.query
        if(passkey !== process.env.PASS_KEY) return res.status(403).send("Unauthorized: Wrong Pass Key")
        const user = await User.find()
        if(!user[0]){
            return res.status(403).send("No User Found")
        }
        const {accessToken} = user[0]
        const text = await generateTweet()
        console.log(text);
        
        const result = await axios.post(TWEET_URL,text,{
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
        })
        res.status(200).send({
            data: result.data
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            message:"Error occured"
        })
    }
})

app.post("/tweet", async (req, res)=>{
    try{
        const {passkey} = req.query
        if(passkey !== process.env.PASS_KEY) return res.status(403).send("Unauthorized: Wrong Pass Key")
        const text = req.body
        const user = await User.find()
        if(!user[0]){
            return res.status(403).send("No User Found")
        }
        const {accessToken} = user[0]
        const result = await axios.post(TWEET_URL,text,{
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
        })
        res.status(200).send({
            data: result.data
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            message:"Error occured"
        })
    }
})

app.get("/generate", async (req, res)=>{
    try{
        const {passkey} = req.query
        if(passkey !== process.env.PASS_KEY) return res.status(403).send("Unauthorized: Wrong Pass Key")
        const result = await generateTweet()
        res.status(200).send({
            data: result
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            message:"Error occured"
        })
    }
})




app.listen(process.env.PORT || 3001, () => {
    console.log(`Server is running on port ${process.env.PORT || 3001}`);
    makeRandomTweet()
    start()
});

console.log("Bot is running...");

