import dotenv from 'dotenv';
import express from 'express';
import generateTweet from './config/gemini.config.js';
import postTweet from './services/post.service.js';
dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/tweet', async (req, res) => {
    const message = await generateTweet();
    await postTweet(message);
    console.log('Tweet posted! ' + message);
    res.json({message: message, success: true});
});

app.listen(process.env.PORT || 3001, () => {
    console.log(`Server is running on port ${process.env.PORT || 3001}`);
});

console.log("Bot is running...");

