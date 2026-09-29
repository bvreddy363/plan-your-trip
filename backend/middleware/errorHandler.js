function errorHandler(error, req, res, next) {
  let statusCode = error.statusCode || error.status || 500;
  if (error.name === "ValidationError" || error.name === "CastError" || error.type === "entity.parse.failed" || error.code === 11000) {
    statusCode = 400;
  }
  const message = statusCode === 500
    ? "Something went wrong on the server"
    : error.type === "entity.parse.failed" ? "Request body contains invalid JSON" : error.message;

  if (statusCode === 500) {
    console.error(error.message);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;