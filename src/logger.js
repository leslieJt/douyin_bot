const path = require('path');
const moment = require('moment');
const { createLogger, transports, format, config } = require('winston');

const { printf } = format;

const logDir = path.resolve(__dirname, '../logs');

const timestamp = () =>
  moment()
    .format('YYYY-MM-DD HH:MM:ss')
    .trim();

const myFormat = printf(
  info => `${info.level}:${timestamp()}:${JSON.stringify(info.message)}`
);

const logger = createLogger({
  levels: config.syslog.levels,
  format: myFormat,
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error'
    }),
    new transports.File({
      filename: path.join(logDir, 'combined.log'),
      level: 'info'
    })
  ]
});

module.exports = logger;
