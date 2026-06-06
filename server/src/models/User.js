const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
    },
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastSolvedDate: { type: Date },
    },
    dailyStreak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastSolvedDate: { type: Date },
    },
    preferences: {
      dailyGoal: { type: Number, default: 3 },
      focusTopics: [{ type: String }],
    },
    dailyProblem: {
      problemTitle: String,
      problemSlug: String,
      difficulty: String,
      topics: [String],
      sourceUrl: String,
      sourceLabel: String,
      weakestTopic: String,
      reason: String,
      pickedAt: Date,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) return;

  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email }).select("+passwordHash");
};

module.exports = mongoose.model("User", userSchema);
