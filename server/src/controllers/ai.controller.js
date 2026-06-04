const hintService = require("../services/ai/hint.service");
const resumeService = require("../services/ai/resume.service");
const interviewQuestionService = require("../services/ai/interviewQuestion.service");
const Resume = require("../models/Resume");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

async function generateHint(req, res) {
  const { problemTitle, problemDescription, hintLevel } = req.body;

  const result = await hintService.generateHint({
    problemTitle,
    problemDescription,
    hintLevel,
  });

  res.status(200).json(new ApiResponse(200, result, "Hint generated"));
}

async function uploadResume(req, res) {
  const { buffer, originalname: fileName } = req.file;

  const { extractedData, rawText } = await resumeService.analyzeResume(buffer);

  const resume = await resumeService.saveResumeAnalysis({
    userId: req.user._id,
    fileName,
    rawText,
    extractedData,
  });

  res.status(200).json(
    new ApiResponse(200, { resumeId: resume._id, extractedData }, "Resume analyzed"),
  );
}

async function generateInterviewQuestions(req, res) {
  const { resumeId } = req.params;
  const { targetRole, questionCount } = req.body;

  const resume = await Resume.findById(resumeId);

  if (!resume || resume.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(404, "Resume not found");
  }

  const extractedSkills = resume.extractedData?.extractedSkills || [];

  const questions = await interviewQuestionService.generateQuestions({
    extractedSkills,
    targetRole,
    questionCount,
  });

  const saved = await interviewQuestionService.saveQuestions({
    userId: req.user._id,
    resumeId,
    targetRole,
    questions,
  });

  res.status(200).json(
    new ApiResponse(200, { resumeId, questions: saved.questions }, "Questions generated"),
  );
}

module.exports = { generateHint, uploadResume, generateInterviewQuestions };
