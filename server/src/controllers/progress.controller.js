const progressService = require("../services/progress.service");
const ApiResponse = require("../utils/ApiResponse");

async function upsertProgress(req, res) {
  const result = await progressService.upsertProgress({
    userId: req.user._id,
    problemId: req.body.problemId,
    status: req.body.status,
    timeSpentMinutes: req.body.timeSpentMinutes,
  });

  res
    .status(200)
    .json(new ApiResponse(200, result, "Progress updated successfully"));
}

async function getUserProgress(req, res) {
  const result = await progressService.getUserProgress(req.user._id);

  res.status(200).json(new ApiResponse(200, result));
}

async function getProgressForProblem(req, res) {
  const result = await progressService.getProgressForProblem(
    req.user._id,
    req.params.problemId,
  );

  if (!result) {
    return res.status(200).json(new ApiResponse(200, null, "No progress yet"));
  }

  res.status(200).json(new ApiResponse(200, result));
}

module.exports = {
  upsertProgress,
  getUserProgress,
  getProgressForProblem,
};
