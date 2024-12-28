import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import User from '../model/user.model.js';
import generateTweet from './gemini.config.js';
import axios from 'axios';
import { incrementTweetCount } from '../bot.js';
dotenv.config();

export const TWEET_URL = "https://api.x.com/2/tweets"

const client = new TwitterApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });
  
export const refreshToken = async () => {
  try{
    const user = await User.find()
        if(!user[0]){
            throw Error("No User Found")
        }
    const {refreshToken} = user[0]
    const {accessToken, refreshToken:newRefreshToken, expiresIn} = await client.refreshOAuth2Token(refreshToken)
    console.log(accessToken, newRefreshToken);
    
    user[0].set({
      accessToken,
      refreshToken:newRefreshToken,
      expiresIn
    })
    await user[0].save()
  }catch(err){
    console.log(err);
  }
}

export const makeRandomTweet = async () => {
  try{
    const user = await User.find()
    if(!user[0]){
        return res.status(403).send("No User Found")
    }
    const {accessToken} = user[0]
    const text = await generateTweet()
    await axios.post(TWEET_URL,text,{
        headers:{
            Authorization:`Bearer ${accessToken}`
        }
    })
    console.log("Tweet made on "+ new Date());
    incrementTweetCount()
}catch(err){
    console.log(err);
}
}

// refreshToken()

export default client;
