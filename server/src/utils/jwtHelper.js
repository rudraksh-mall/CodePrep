const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const ApiError = require('./ApiError');

function generateToken(userId, name, email) {
  return jwt.sign({ userId, name, email }, jwtSecret, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, jwtSecret);
  } catch {
    throw new ApiError(401, 'Not authenticated');
  }
}

module.exports = { generateToken, verifyToken };
