const hintService = require("../services/ai/hint.service");
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

module.exports = { generateHint };
