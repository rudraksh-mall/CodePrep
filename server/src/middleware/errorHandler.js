const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

function errorHandler(err, _req, res, _next) {
  let statusCode = 500;
  let message = 'Internal server error';

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.join(', ');
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Email already in use';
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Not authenticated';
  }

  if (statusCode === 500) {
    console.error('Unexpected error:', err);
  }

  const response = new ApiResponse(statusCode, null, message);

  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
