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

async function getConsistency(req, res) {
  const result = await analyticsService.getConsistency(req.user._id);
  res.status(200).json(new ApiResponse(200, result));
}

async function getMonthlyTrends(req, res) {
  const result = await analyticsService.getMonthlyTrends(req.user._id);
  res.status(200).json(new ApiResponse(200, result));
}

async function getTopicGrowth(req, res) {
  const days = parseInt(req.query.days) || 30;
  const result = await analyticsService.getTopicGrowth(req.user._id, days);
  res.status(200).json(new ApiResponse(200, result));
}

async function getTimeInvestment(req, res) {
  const result = await analyticsService.getTimeInvestment(req.user._id);
  res.status(200).json(new ApiResponse(200, result));
}

async function getReadinessBreakdown(req, res) {
  const result = await analyticsService.getReadinessBreakdown(req.user._id);
  res.status(200).json(new ApiResponse(200, result));
}

async function getTopicMastery(req, res) {
  const result = await analyticsService.getTopicMastery(req.user._id);
  res.status(200).json(new ApiResponse(200, result));
}

async function getWeakTopics(req, res) {
  const result = await analyticsService.getWeakTopics(req.user._id);
  res.status(200).json(new ApiResponse(200, result));
}

module.exports = {
  getSummary,
  getByTopic,
  getByDifficulty,
  getOverTime,
  getConsistency,
  getMonthlyTrends,
  getTopicGrowth,
  getTimeInvestment,
  getReadinessBreakdown,
  getTopicMastery,
  getWeakTopics,
};
