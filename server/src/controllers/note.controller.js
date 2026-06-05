const noteService = require("../services/note.service");
const ApiResponse = require("../utils/ApiResponse");

async function upsertNote(req, res) {
  const result = await noteService.upsertNote({
    userId: req.user._id,
    problemId: req.body.problemId,
    content: req.body.content,
  });

  res.status(200).json(new ApiResponse(200, result, "Note saved"));
}

async function getNote(req, res) {
  const result = await noteService.getNote(req.user._id, req.params.problemId);

  res.status(200).json(new ApiResponse(200, result || { content: "" }));
}

module.exports = { upsertNote, getNote };
