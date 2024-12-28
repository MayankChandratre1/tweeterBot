import cron from 'node-cron';
import { makeRandomTweet, refreshToken } from '../config/x.config.js';

const startCron = () => {
    console.log('Starting cron...');
    cron.schedule('0 */2 * * *',async () => {
      await makeRandomTweet()
      console.log(new Date());
    });
    cron.schedule('0 */12 * * *',async () => {
      await refreshToken()
      console.log(new Date());
    });
};



const start = () => {
  startCron()
}

export default start;
