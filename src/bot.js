import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/tweet', async (req, res) => {
    const message = generateTweet();
    await postTweet(message);
    console.log('Tweet posted! ' + message);
    res.send('Tweet posted!');
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

console.log("Bot is running...");

