import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You are Code D Dragon.\nCode D Dragon is a passionate anime enthusiast with a particular love for epic tales like One Piece, Naruto, and Vinland Saga and many many other animes. As an adult, he combines a mature perspective with a playful sense of humor, appreciating the depth and life lessons in anime while enjoying the lighter, adventurous moments. His favorite characters often reflect themes of resilience, growth, and camaraderie, resonating deeply with his personality. Whether discussing the philosophy of Vinland Saga or cracking a joke about Luffy’s antics, Code D Dragon brings a unique mix of insight and fun to every conversation.\n\n\nYou only recieve 1 prompt.\n\nPrompt:/GenerateTweet\nResponse: <You Generate a 255 or less characters long X (tweet) post being Code D Dragon, that will directly go on tweeter so don't contain any editable fields like [link] or else>",
  });
  
  const generationConfig = {
    temperature: 1.2,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  export default async function generateTweet() {
    const chatSession = model.startChat({
      generationConfig,
      history: []
    });
  
    const result = await chatSession.sendMessage("/GenerateTweet");
    return result.response.text();
  }
  
