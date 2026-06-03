const Note = require("../models/Note");

async function upsertNote({ userId, problemId, content }) {
  return Note.findOneAndUpdate(
    { userId, problemId },
    { content },
    { upsert: true, new: true },
  );
}

async function getNote(userId, problemId) {
  return Note.findOne({ userId, problemId });
}

module.exports = { upsertNote, getNote };
