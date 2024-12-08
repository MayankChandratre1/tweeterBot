import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import xConfig from './config/x.config.js';
import postTweet from './services/post.service.js';

dotenv.config();



    // (async () => {
    // try {
    //     const user = await client.v2.me();
    //     console.log(`Authenticated as ${user.data.username}`);
    // } catch (error) {
    //     console.error('Error during authentication:', error);
    // }
    // })();
postTweet("Hello, Twitter! This is my JS bot 🤖");
