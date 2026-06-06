const mongoose = require("mongoose");

const userPlatformSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  platform: {
    type: String,
    enum: ["leetcode", "codeforces"],
    required: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  lastSyncedAt: {
    type: Date,
  },
  stats: {
    totalSolved: { type: Number, default: 0 },
    easySolved: { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    hardSolved: { type: Number, default: 0 },
    totalSubmissions: { type: Number, default: 0 },
    submissionCalendar: { type: Map, of: Number, default: {} },
  },
}, { timestamps: true });

userPlatformSchema.index({ userId: 1 });
userPlatformSchema.index({ userId: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model("UserPlatform", userPlatformSchema);
