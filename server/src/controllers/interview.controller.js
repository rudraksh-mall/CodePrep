const interviewService = require("../services/ai/interview.service");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

async function startInterview(req, res) {
  const { type, duration } = req.body;
  const result = await interviewService.startSession({
    userId: req.user._id,
    interviewType: type,
    duration,
  });
  res.status(201).json(new ApiResponse(201, result, "Interview started"));
}

async function answerQuestion(req, res) {
  const { sessionId, answer } = req.body;
  const result = await interviewService.answerQuestion({
    sessionId,
    userId: req.user._id,
    answer,
  });
  res.status(200).json(new ApiResponse(200, result, "Answer evaluated"));
}

async function endInterview(req, res) {
  const { sessionId } = req.body;
  const result = await interviewService.endSession({
    sessionId,
    userId: req.user._id,
  });
  res.status(200).json(new ApiResponse(200, result, "Interview ended"));
}

async function getSession(req, res) {
  const { sessionId } = req.params;
  const result = await interviewService.getSession({ sessionId, userId: req.user._id });
  res.status(200).json(new ApiResponse(200, result, "Session retrieved"));
}

async function getHistory(req, res) {
  const result = await interviewService.getHistory(req.user._id);
  res.status(200).json(new ApiResponse(200, result, "History retrieved"));
}

async function uploadMockResume(req, res) {
  const { buffer, originalname: fileName } = req.file;
  const result = await interviewService.uploadMockResume({
    userId: req.user._id,
    buffer,
    fileName,
  });
  res.status(200).json(new ApiResponse(200, result, "Mock interview resume uploaded"));
}

async function getLatestMockResume(req, res) {
  const result = await interviewService.getLatestMockResume(req.user._id);
  res.status(200).json(
    new ApiResponse(200, result, result ? "Latest mock resume retrieved" : "No mock resume found"),
  );
}

module.exports = {
  startInterview,
  answerQuestion,
  endInterview,
  uploadMockResume,
  getLatestMockResume,
  getSession,
  getHistory,
};
