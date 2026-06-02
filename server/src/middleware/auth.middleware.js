const { verifyToken } = require('../utils/jwtHelper');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

async function authenticate(req, _res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Not authenticated');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new ApiError(401, 'Not authenticated');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err instanceof ApiError ? err : new ApiError(401, 'Not authenticated'));
  }
}

module.exports = authenticate;
