const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('./logger');

const dyUrl = 'https://dy.golmic.com/';

/**
 * @private
 * @param {Object} msg
 * @returns {boolean} is msg a bot command
 */
const isBotCommand = msg =>
  msg && msg.entities && msg.entities.some(e => e.type === 'bot_command');

/**
 * @private
 * @param {string} pageUrl
 * @returns {{avatar, username, desc, playAddr, cover}} video info from given url
 */
const getVideoInfo = async pageUrl => {
  const { data } = await axios.get(pageUrl);
  const $ = cheerio.load(data);
  const $videoInfo = $('.video-info');

  return {
    avatar: $videoInfo.find('.avatar img').attr('src'),
    username: $videoInfo
      .find('.info .name')
      .text()
      .replace(/^@/, ''),
    desc: $videoInfo.find('.desc').text(),
    playAddr: data.match('playAddr: ?"([^"]+)')[1],
    cover: data.match('cover: ?"([^"]+)')[1]
  };
};

/**
 * @public
 * bot command callback
 */
const responseVideo = bot => async msg => {
  try {
    const response = await axios.get(dyUrl);
    const {
      data: { url }
    } = response;
    const videoInfo = await getVideoInfo(url);

    logger.info(videoInfo);

    bot.sendMessage(msg.chat.id, JSON.stringify(videoInfo));
  } catch (err) {
    bot.sendMessage(
      msg.chat.id,
      'Oops! something wrong, please try again late 😓'
    );
  }
};

/**
 * @public
 * bot command callback
 */
const showHelp = bot => msg => {
  bot.sendMessage(msg.chat.id, 'no one gonna help you 😂');
};

/**
 * @public
 * bot command callback
 */
const handleUnknownMessage = bot => msg => {
  if (!isBotCommand(msg)) {
    bot.sendMessage(msg.chat.id, "I'm not a chat bot, call siri please 😅");
  }
  logger.info(msg);
};

/**
 * @public
 * handle error
 */
// eslint-disable-next-line no-unused-vars
const handleError = bot => error => {
  logger.error(JSON.stringify(error));
};

module.exports = {
  responseVideo,
  showHelp,
  handleUnknownMessage,
  handleError
};
