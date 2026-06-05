const mongoose = require("mongoose");

const weekSchema = new mongoose.Schema(
  {
    weekNumber: { type: Number, required: true },
    theme: { type: String, required: true },
    topics: [String],
    goals: [String],
    checkpoints: [String],
  },
  { _id: false },
);

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weakTopics: [String],
    targetRole: { type: String, required: true },
    duration: {
      type: Number,
      required: true,
      enum: [30, 60, 90],
    },
    currentLevel: {
      type: String,
      required: true,
      enum: ["beginner", "intermediate", "advanced"],
    },
    weeks: [weekSchema],
  },
  { timestamps: true },
);

roadmapSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Roadmap", roadmapSchema);
