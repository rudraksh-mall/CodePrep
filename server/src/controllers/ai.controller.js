const hintService = require("../services/ai/hint.service");
const resumeService = require("../services/ai/resume.service");
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

module.exports = { generateHint, uploadResume };
