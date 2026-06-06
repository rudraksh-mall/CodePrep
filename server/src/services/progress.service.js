const Progress = require("../models/Progress");
const User = require("../models/User");

async function upsertProgress({ userId, problemId, status, timeSpentMinutes }) {
  const updateData = {
    status,
    timeSpentMinutes,
    updatedAt: new Date(),
  };

  if (status === "solved") {
    updateData.solvedAt = new Date();
  }

  const progress = await Progress.findOneAndUpdate(
    { userId, problemId },
    { $set: updateData },
    {
      upsert: true,
      new: true,
    }
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

async function getAnalyticsSummary(userId) {
  const solvedProgress = await Progress.find({ userId, status: "solved" })
    .populate("problemId", "topics")
    .lean();

  const solvedPerTopic = {};
  let totalSolved = 0;

  for (const p of solvedProgress) {
    if (!p.problemId || !p.problemId.topics) continue;
    totalSolved++;
    for (const topic of p.problemId.topics) {
      solvedPerTopic[topic] = (solvedPerTopic[topic] || 0) + 1;
    }
  }

  return { solvedPerTopic, totalSolved };
}

module.exports = {
  upsertProgress,
  updateStreak,
  getUserProgress,
  getProgressForProblem,
  getAnalyticsSummary,
};
