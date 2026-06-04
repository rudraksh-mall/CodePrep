const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    rawText: {
      type: String,
    },
    extractedData: {
      extractedSkills: [String],
      experience: [
        {
          title: String,
          company: String,
          duration: String,
          description: String,
        },
      ],
      education: [
        {
          degree: String,
          institution: String,
          year: String,
        },
      ],
    },
  },
  { timestamps: true },
);

resumeSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Resume", resumeSchema);
