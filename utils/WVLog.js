const log4js = require('log4js');
const { LogConfig } = require('../config');

log4js.configure(LogConfig);

const logger = log4js.getLogger();
const errLogger = log4js.getLogger('err');
const runLogger = log4js.getLogger('run');

const WVLogger = {
  info (info) {
    logger.info(info);
  },
  error (apiInfo, err) {
    const result = {
      apiInfo,
      err
    };
    errLogger.error(result);
  },
  forwardInfo (logInfo) {
    runLogger.info(logInfo);
  }
};

module.exports = {
  WVLogger
}