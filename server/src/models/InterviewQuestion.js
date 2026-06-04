const mongoose = require("mongoose");

const questionSubSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    category: {
      type: String,
      enum: ["technical", "behavioral", "system design"],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    skill: { type: String },
  },
  { _id: false },
);

const interviewQuestionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    targetRole: { type: String, required: true },
    questions: [questionSubSchema],
  },
  { timestamps: true },
);

interviewQuestionSchema.index({ userId: 1, resumeId: 1 });

module.exports = mongoose.model("InterviewQuestion", interviewQuestionSchema);
