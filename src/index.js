require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const {
  responseVideo,
  showHelp,
  handleUnknownMessage,
  handleError
} = require('./action');

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

bot.onText(/\/start/, responseVideo(bot));
bot.onText(/\/next/, responseVideo(bot));
bot.onText(/\/help/, showHelp(bot));

bot.on('message', handleUnknownMessage(bot));
bot.on('polling_error', handleError(bot));
