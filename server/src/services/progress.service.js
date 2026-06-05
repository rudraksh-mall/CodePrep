const Progress = require("../models/Progress");
const User = require("../models/User");

async function upsertProgress({ userId, problemId, status, timeSpentMinutes }) {
  const progress = await Progress.findOneAndUpdate(
    { userId, problemId },
    { status, timeSpentMinutes, updatedAt: new Date() },
    { upsert: true, new: true },
  );

  if (status === "solved") {
    await updateStreak(userId);
  }

  return progress;
}

async function updateStreak(userId) {
  const user = await User.findById(userId);

  if (!user) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastSolved = user.streak.lastSolvedDate;

  let current = 1;

  if (lastSolved) {
    const lastStart = new Date(lastSolved);
    lastStart.setHours(0, 0, 0, 0);

    if (lastStart.getTime() === today.getTime()) {
      current = user.streak.current;
    } else if (lastStart.getTime() === yesterday.getTime()) {
      current = user.streak.current + 1;
    }
  }

  const longest = Math.max(current, user.streak.longest || 0);

  await User.findByIdAndUpdate(userId, {
    "streak.current": current,
    "streak.longest": longest,
    "streak.lastSolvedDate": today,
  });
}

async function getUserProgress(userId) {
  return Progress.find({ userId })
    .populate("problemId", "title slug difficulty topics")
    .sort({ updatedAt: -1 });
}

async function getProgressForProblem(userId, problemId) {
  return Progress.findOne({ userId, problemId }).populate(
    "problemId",
    "title slug difficulty topics",
  );
}

module.exports = {
  upsertProgress,
  updateStreak,
  getUserProgress,
  getProgressForProblem,
};
