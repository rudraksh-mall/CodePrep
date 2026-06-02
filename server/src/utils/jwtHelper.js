const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const ApiError = require('./ApiError');

function generateToken(userId) {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, jwtSecret);
  } catch {
    throw new ApiError(401, 'Not authenticated');
  }
}

module.exports = { generateToken, verifyToken };
