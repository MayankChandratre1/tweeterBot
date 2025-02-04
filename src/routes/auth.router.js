import express from "express"
import dotenv from "dotenv"
import client, { refreshToken } from "../config/x.config.js"
import User from "../model/user.model.js"
import generateTweet from "../config/gemini.config.js"
dotenv.config()

const authRouter = express.Router()

authRouter.get("/", (req, res)=>{
    res.send("/auth routes")
})

authRouter.get("/login",async (req, res)=>{
      const {passkey} = req.query
      if(passkey !== process.env.PASS_KEY) return res.status(403).send("Unauthorized: Wrong Pass Key")
      const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
        'https://tweeter-bot-orcin.vercel.app/callback',
        { scope: ["tweet.read", "users.read", "tweet.write", "offline.access"] }
      );
      const user = await User.find()
      if(user.length == 0){
        await User.create({
          codeVerifier,
          state
        })
      }else{
         user[0].$set({
          codeVerifier,
          state
        })
        await user[0].save()
      }
      console.log(`Visit the following URL to authenticate: ${url}`);
      return res.redirect(url)
})

authRouter.get('/callback', async (req, res) => {
    const {state, code} = req.query
    const user = await User.find()
    const {codeVerifier, sessionState} = user[0]
    if(!codeVerifier || !sessionState || !state){
        return res.status(401).send("Invalid request")
    }
    if(state != sessionState){
        return res.status(403).send("Expired Session")
    }

    client.loginWithOAuth2({ code, codeVerifier, redirectUri: CALLBACK_URL })
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
    })
    .catch(() => res.status(403).send('Invalid verifier or access tokens!'));
    res.json({message: "Callback Recieved", success: true, url: req.url, session, state, code});
});
 
authRouter.post('/refresh',async (req, res)=>{
  try{
      const {passkey} = req.query
      if(passkey !== process.env.PASS_KEY) return res.status(403).send("Unauthorized: Wrong Pass Key")
      await refreshToken()
      res.json({
        message:"Refreshed Your Token"
      })
  }catch(err){
    console.log(err);
    res.status(500).send("Error refreshing token")
  }

})



export default authRouter