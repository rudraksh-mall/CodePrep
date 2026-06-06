const interviewService = require("../services/ai/interview.service");
const ApiResponse = require("../utils/ApiResponse");

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

module.exports = {
  startInterview,
  answerQuestion,
  endInterview,
};
