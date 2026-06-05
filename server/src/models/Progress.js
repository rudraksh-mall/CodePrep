const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
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

    status: {
      type: String,
      enum: ["attempted", "solved", "unsolved"],
      default: "unsolved",
    },

    timeSpentMinutes: {
      type: Number,
      default: 0,
    },

    solvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

progressSchema.index({ userId: 1, problemId: 1 }, { unique: true });
progressSchema.index({ userId: 1, status: 1 });
progressSchema.index({ userId: 1, updatedAt: -1 });

module.exports = mongoose.model("Progress", progressSchema);