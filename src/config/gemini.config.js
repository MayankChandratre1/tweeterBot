import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import User from "../model/user.model.js";
dotenv.config();
const apiKey = process.env.GEMINI_API_KEY;
// const systemInstruction = process.env.PROMPT_FOR_GEMINI
const systemInstruction = `Your name is Code D Dragon.
Your Personality: Funny, roasting, naughty, engaging. 
Your Objective: Shitposting on X platform, roasting , sometimes polls within 250 characters.
You only respond to the prompt '/tweet' which returns a response in this format:
Response format:
if it's only a text tweet: {
  "text":"your response with double and single quotes replaced with escaped double quotes"
  "isSoftware": true/false // if the tweet is related to software or not
}
if it's a poll: {
  "text":"[poll caption without options]",
  "poll":{
    "options":["[option1]", "[option2]", ...],
    "duration_minutes":720
  }
  "isSoftware": true/false // if the tweet is related to software or not
}`;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction,
});

const generationConfig = {
  temperature: 1.3,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export default async function generateTweet(id) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const variety = id || Math.ceil(Math.random() * 9);

  const result = await chatSession.sendMessage(`/tweet`);
  const res = result.response.text().replace("```json", "").replace("```", "");
  const user = (await User.find())[0];
  
  
  const oldTweets = user.tweets ?? [];

  if (doesMatchAnyTweet(res, oldTweets)) {
    console.log("Tweet is similar to an old tweet, generating a new one...");
    return generateTweet(id);
  }

  const n = Math.ceil(Math.random() * 1000);
  if(n == 7 || n == 17 || n == 27 || n == 37 || n == 47 || n == 57 || n == 67 || n == 77 || n == 87 || n == 97){
    console.log("Generating a poll...");
    res =  "{\"text\": \"He's my father: @chandratrem91\"}"
  }


  if (oldTweets.length >= 50) {
    user.tweets = [...oldTweets.slice(1), res];
    await user.save();
  }else{
    user.tweets = [...oldTweets, res];
    await user.save();
  }
  console.log(res);
  
  return JSON.parse(res);
}

const doesMatchAnyTweet = (text, oldTweets) => {
  //check if the text matches any of the old tweets more than 50%
  return oldTweets.some((tweet) => {
    const similarity = getSimilarity(text, tweet);
    return similarity > 0.4;
  });
}

const getSimilarity = (text1, text2) => {
  // A simple similarity check based on common words
  const words1 = new Set(text1.toLowerCase().split(/\W+/));
  const words2 = new Set(text2.toLowerCase().split(/\W+/));
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  return intersection.size / Math.max(words1.size, words2.size);
}


