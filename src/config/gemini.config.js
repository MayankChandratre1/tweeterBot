import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
  const apiKey = process.env.GEMINI_API_KEY;
  const systemInstruction = process.env.PROMPT_FOR_GEMINI
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  export default async function generateTweet(id) {
    const chatSession = model.startChat({
      generationConfig,
      history: []
    });

    const variety = id || Math.ceil(Math.random()*9)
  
    const result = await chatSession.sendMessage(`/tweet`);
    const res = result.response.text().replace("```json","").replace("```","")
    
    return JSON.parse(res);
  }
  
  generateTweet()
