const cron = require('node-cron');

const startCron = () => {
    console.log('Starting cron...');
    cron.schedule('0 * * * *', () => {
      const message = generateTweet();
      postTweet(message);
    });
};

export default startCron;
