const hintService = require("../services/ai/hint.service");
const resumeService = require("../services/ai/resume.service");
const interviewQuestionService = require("../services/ai/interviewQuestion.service");
const assistantService = require("../services/ai/assistant.service");
const roadmapService = require("../services/ai/roadmap.service");
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
    new ApiResponse(200, { resumeId: resume._id, fileName: resume.fileName, extractedData }, "Resume analyzed"),
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

async function chat(req, res) {
  const { message, chatHistory } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  let isClientConnected = true;
  req.on("close", () => {
    isClientConnected = false;
  });

  try {
    const stream = await assistantService.streamAssistantResponse({
      message,
      chatHistory: chatHistory || [],
    });

    for await (const chunk of stream) {
      if (!isClientConnected) break;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    }

    if (isClientConnected) {
      res.write("data: [DONE]\n\n");
    }
  } catch (err) {
    if (isClientConnected) {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    }
  } finally {
    res.end();
  }
}

async function generateRoadmap(req, res) {
  const { weakTopics, targetRole, duration, currentLevel } = req.body;

  const roadmap = await roadmapService.generateRoadmap({
    weakTopics: weakTopics || [],
    targetRole,
    duration,
    currentLevel,
    userId: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, roadmap, "Roadmap generated"));
}

async function getRoadmap(req, res) {
  const roadmap = await roadmapService.getRoadmap(req.user._id);

  res.status(200).json(new ApiResponse(200, roadmap || null, roadmap ? "Roadmap retrieved" : "No roadmap found"));
}

async function getLatestResumeAnalysis(req, res) {
  const result = await resumeService.getLatestResumeAnalysis(req.user._id);

  res.status(200).json(
    new ApiResponse(200, result, result ? "Latest analysis retrieved" : "No analysis found"),
  );
}

module.exports = { generateHint, uploadResume, generateInterviewQuestions, chat, generateRoadmap, getRoadmap, getLatestResumeAnalysis };
