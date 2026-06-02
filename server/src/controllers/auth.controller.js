const authService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');

async function register(req, res) {
  const result = await authService.register(req.body);

  res.status(201).json(new ApiResponse(201, result, 'User registered successfully'));
}

async function login(req, res) {
  const result = await authService.login(req.body);

  res.status(200).json(new ApiResponse(200, result, 'Login successful'));
}

async function getMe(req, res) {
  const user = await authService.getMe(req.user._id);

  res.status(200).json(new ApiResponse(200, user));
}

module.exports = { register, login, getMe };
