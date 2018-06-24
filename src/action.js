const axios = require('axios');
const cheerio = require('cheerio');

const dyUrl = 'https://dy.golmic.com/';

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

const responseVideo = bot => async msg => {
  try {
    const response = await axios.get(dyUrl);
    const {
      data: { url }
    } = response;
    const videoInfo = await getVideoInfo(url);

    console.log(videoInfo);

    bot.sendMessage(msg.chat.id, JSON.stringify(videoInfo));
  } catch (err) {
    bot.sendMessage(
      msg.chat.id,
      'Oops! something wrong, please try again late 😓'
    );
  }
};

const showHelp = bot => msg => {
  bot.sendMessage(msg.chat.id, 'no one gonna help you 😂');
};

const handleUnknownMessage = bot => msg => {
  console.log(msg);
};

module.exports = {
  responseVideo,
  showHelp,
  handleUnknownMessage
};
