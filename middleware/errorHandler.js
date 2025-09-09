const errorHandler = (error, req, res, next) => {
  console.log(error); // find out how to use loggers (log4j/slf4j). Otherwise no errors at all makes it difficult to debug.
  return res.status(400).send(error.message);
};

module.exports = errorHandler;
