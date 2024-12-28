import client from "../config/x.config.js";

const postTweet = async (message) => {
    try {
      await client.v2.reply(message);
      
      console.log('Tweet posted successfully:', message);
    } catch (error) {
      console.error('Error posting tweet:', error);
    }
  };
  
export default postTweet;
  