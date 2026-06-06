const mongoose = require("mongoose");

const learningEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  topic: { type: String },
  pattern: { type: String },
  status: {
    type: String,
    enum: ["attempted", "solved", "unsolved"],
    required: true,
  },
  hintsUsed: { type: Number, default: 0 },
  attempts: { type: Number, default: 1 },
  timeSpentMinutes: { type: Number, default: 0 },
  notes: { type: String },
}, { timestamps: true });

learningEventSchema.index({ userId: 1, createdAt: -1 });
learningEventSchema.index({ userId: 1, problemId: 1 });

module.exports = mongoose.model("LearningEvent", learningEventSchema);
