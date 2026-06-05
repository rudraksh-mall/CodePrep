const mongoose = require("mongoose");
const Progress = require("../models/Progress");
const Problem = require("../models/Problem");
const User = require("../models/User");

async function getSummary(userId) {
  const [solved, attempted] = await Promise.all([
    Progress.countDocuments({ userId, status: "solved" }),
    Progress.countDocuments({ userId, status: "attempted" }),
  ]);

  const user = await User.findById(userId).select("streak");

  return {
    totalSolved: solved,
    totalAttempted: attempted,
    currentStreak: user?.streak?.current || 0,
    longestStreak: user?.streak?.longest || 0,
  };
}

async function getByTopic(userId) {
  const objectId = new mongoose.Types.ObjectId(userId);

  const [topicTotals, userProgress] = await Promise.all([
    Problem.aggregate([
      { $unwind: "$topics" },
      { $group: { _id: "$topics", total: { $sum: 1 } } },
    ]),
    Progress.aggregate([
      { $match: { userId: objectId } },
      {
        $lookup: {
          from: "problems",
          localField: "problemId",
          foreignField: "_id",
          as: "problem",
        },
      },
      { $unwind: "$problem" },
      { $unwind: "$problem.topics" },
      {
        $group: {
          _id: "$problem.topics",
          solved: { $sum: { $cond: [{ $eq: ["$status", "solved"] }, 1, 0] } },
          attempted: {
            $sum: { $cond: [{ $eq: ["$status", "attempted"] }, 1, 0] },
          },
        },
      },
    ]),
  ]);

  const progressMap = {};
  for (const p of userProgress) {
    progressMap[p._id] = { solved: p.solved, attempted: p.attempted };
  }

  const results = topicTotals
    .map((t) => ({
      topic: t._id,
      solved: progressMap[t._id]?.solved || 0,
      attempted: progressMap[t._id]?.attempted || 0,
      total: t.total,
    }))
    .sort((a, b) => b.total - a.total);

  return results;
}

async function getByDifficulty(userId) {
  const objectId = new mongoose.Types.ObjectId(userId);

  const results = await Progress.aggregate([
    { $match: { userId: objectId } },
    {
      $lookup: {
        from: "problems",
        localField: "problemId",
        foreignField: "_id",
        as: "problem",
      },
    },
    { $unwind: "$problem" },
    {
      $group: {
        _id: "$problem.difficulty",
        solved: { $sum: { $cond: [{ $eq: ["$status", "solved"] }, 1, 0] } },
        attempted: {
          $sum: { $cond: [{ $eq: ["$status", "attempted"] }, 1, 0] },
        },
        total: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        difficulty: "$_id",
        solved: 1,
        attempted: 1,
        total: 1,
      },
    },
  ]);

  return results;
}

async function getOverTime(userId, days = 365) {
  const objectId = new mongoose.Types.ObjectId(userId);

  console.log("Analytics User:", userId);

  const allDocs = await Progress.find({});
  console.log("ALL DOCS:", allDocs.length);

  const userDocs = await Progress.find({
    userId: objectId,
  });

  console.log("USER DOCS:", userDocs.length);

  const solvedDocs = await Progress.find({
    userId: objectId,
    status: "solved",
  });

  console.log("SOLVED DOCS:", solvedDocs.length);
  console.log("SOLVED:", solvedDocs);

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const results = await Progress.aggregate([
  {
    $match: {
      userId: objectId,
      status: "solved",
      solvedAt: { $gte: cutoff },
    },
  },
  {
    $group: {
      _id: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$solvedAt",
          timezone: "Asia/Kolkata",
        },
      },
      count: { $sum: 1 },
    },
  },
  {
    $sort: { _id: 1 },
  },
  {
    $project: {
      _id: 0,
      date: "$_id",
      count: 1,
    },
  },
]);

return results;
}

module.exports = {
  getSummary,
  getByTopic,
  getByDifficulty,
  getOverTime,
};
