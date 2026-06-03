const analyticsService = require("../services/analytics.service");
const ApiResponse = require("../utils/ApiResponse");

async function getSummary(req, res) {
  const result = await analyticsService.getSummary(req.user._id);

  res.status(200).json(new ApiResponse(200, result));
}

async function getByTopic(req, res) {
  const result = await analyticsService.getByTopic(req.user._id);

  res.status(200).json(new ApiResponse(200, result));
}

async function getByDifficulty(req, res) {
  const result = await analyticsService.getByDifficulty(req.user._id);

  res.status(200).json(new ApiResponse(200, result));
}

async function getOverTime(req, res) {
  const days = parseInt(req.query.days) || 30;
  const result = await analyticsService.getOverTime(req.user._id, days);

  res.status(200).json(new ApiResponse(200, result));
}

module.exports = {
  getSummary,
  getByTopic,
  getByDifficulty,
  getOverTime,
};
