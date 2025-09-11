const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "error";
const errorHandler = (error, req, res, next) => {
  logger.error(error);

  return res.status(400).send(error.message);
};

module.exports = errorHandler;
