const mongoose = require("mongoose");
const Progress = require("../models/Progress");
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
    { $unwind: "$problem.topics" },
    {
      $group: {
        _id: "$problem.topics",
        solved: { $sum: { $cond: [{ $eq: ["$status", "solved"] }, 1, 0] } },
        attempted: {
          $sum: { $cond: [{ $eq: ["$status", "attempted"] }, 1, 0] },
        },
        total: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
    { $project: { _id: 0, topic: "$_id", solved: 1, attempted: 1, total: 1 } },
  ]);

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

async function getOverTime(userId, days = 30) {
  const objectId = new mongoose.Types.ObjectId(userId);

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const results = await Progress.aggregate([
    {
      $match: {
        userId: objectId,
        status: "solved",
        updatedAt: { $gte: cutoff },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: "$_id", count: 1 } },
  ]);

  return results;
}

module.exports = {
  getSummary,
  getByTopic,
  getByDifficulty,
  getOverTime,
};
