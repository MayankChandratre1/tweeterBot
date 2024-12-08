import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import xConfig from './config/x.config.js';
import postTweet from './services/post.service.js';

dotenv.config();


startCron();
