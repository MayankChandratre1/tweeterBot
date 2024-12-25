import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

// const client = new TwitterApi({
//     appKey: process.env.API_KEY,
//     appSecret: process.env.API_SECRET,
//     accessToken: process.env.ACCESS_TOKEN,
//     accessSecret: process.env.ACCESS_TOKEN_SECRET,
// });

const client = new TwitterApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });
  
  const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
    'https://oauth.pstmn.io/v1/callback',
    { scope: ['tweet.read', 'tweet.write'] }
  );
  
  console.log(`Visit the following URL to authenticate: ${url}`);
  


export default client;
