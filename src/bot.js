import dotenv from 'dotenv';
import express from 'express';
import generateTweet from './config/gemini.config.js';
import postTweet from './services/post.service.js';
import authRouter from "./routes/auth.router.js"
import { connctDB } from './config/db.config.js';
import client from './config/x.config.js';
import User from './model/user.model.js';
dotenv.config();

const app = express();
app.use(express.json());

connctDB()

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use("/auth", authRouter);

app.get('/tweet', async (req, res) => {
    const message = await generateTweet();
    await postTweet(message);
    console.log('Tweet posted! ' + message);
    res.json({message: message, success: true});
});

app.get('/callback', async (req, res) => {
    const {state, code} = req.query
    const user = await User.find()
    const {codeVerifier, state:sessionState} = user[0]
    if(!codeVerifier || !sessionState || !state){
        return res.status(401).send("Invalid request")
    }
    if(state != sessionState){
        return res.status(403).send("Expired Session")
    }

    client.loginWithOAuth2({ code, codeVerifier, redirectUri: process.env.REDIRECT_URI })
    .then(async ({ client: loggedClient, accessToken, refreshToken, expiresIn }) => {
      // {loggedClient} is an authenticated client in behalf of some user
      // Store {accessToken} somewhere, it will be valid until {expiresIn} is hit.
      // If you want to refresh your token later, store {refreshToken} (it is present if 'offline.access' has been given as scope)
      // Example request
      user[0].set({
        refreshToken
      })
      await user[0].save()
      const { data: userObject } = await loggedClient.v2.me();
      console.log(userObject);
      const result = await loggedClient.v2.tweet(generateTweet())
      console.log("Tweet Posted", JSON.stringify(result));
      res.json({message: "Callback Recieved", success: true, url: req.url, session, state, code});
    })
    .catch((error) =>{
        console.log(error);
        
        res.status(403).send('Invalid verifier or access tokens!')
    })
    
});


app.listen(process.env.PORT || 3001, () => {
    console.log(`Server is running on port ${process.env.PORT || 3001}`);
});

console.log("Bot is running...");

