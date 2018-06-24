const path = require('path');
const { createLogger, transports, format, config } = require('winston');

const { combine, timestamp, printf } = format;

const logDir = path.resolve(__dirname, '../logs');

const myFormat = printf(
  info => `${info.level}\t${info.timestamp}\t${JSON.stringify(info.message)}`
);

const logger = createLogger({
  levels: config.syslog.levels,
  format: combine(timestamp(), myFormat),
  transports: [
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
