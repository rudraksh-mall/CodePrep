const Progress = require("../models/Progress");
const Problem = require("../models/Problem");
const LearningEvent = require("../models/LearningEvent");

const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";
const LEETCODE_STATS_API = "https://leetcode-api-faisalshohag.vercel.app";

async function fetchLeetCodeStats(username) {
  const res = await fetch(`${LEETCODE_STATS_API}/${username}`, {
    headers: { "User-Agent": "CodePrep/1.0" },
  });

  if (!res.ok) throw new Error(`LeetCode stats API returned ${res.status}`);

  return res.json();
}

async function syncLeetCode(userId, username) {
  const data = await fetchLeetCodeStats(username);

  const totalSolved = data.totalSolved || 0;
  const easySolved = data.easySolved || 0;
  const mediumSolved = data.mediumSolved || 0;
  const hardSolved = data.hardSolved || 0;

  console.log(`[syncLeetCode] ${username}: ${totalSolved} solved (E:${easySolved} M:${mediumSolved} H:${hardSolved})`);

  const UserPlatform = require("../models/UserPlatform");
  await UserPlatform.findOneAndUpdate(
    { userId, platform: "leetcode" },
    {
      $set: {
        "stats.totalSolved": totalSolved,
        "stats.easySolved": easySolved,
        "stats.mediumSolved": mediumSolved,
        "stats.hardSolved": hardSolved,
        "stats.totalSubmissions": data.totalSubmissions?.[0]?.submissions || 0,
        "stats.submissionCalendar": data.submissionCalendar || {},
        lastSyncedAt: new Date(),
      },
    },
  );

  return { synced: totalSolved, total: totalSolved };
}

async function syncAllPlatforms(userId) {
  const UserPlatform = require("../models/UserPlatform");
  const linked = await UserPlatform.find({ userId }).lean();
  if (linked.length === 0) return { message: "No platforms linked" };

  const results = [];
  for (const account of linked) {
    try {
      if (account.platform === "leetcode") {
        const r = await syncLeetCode(userId, account.username);
        results.push({ platform: "leetcode", username: account.username, ...r });
      }
    } catch (err) {
      console.error(`[syncLeetCode] Error for ${account.username}:`, err.message);
      results.push({ platform: account.platform, username: account.username, error: err.message });
    }
  }
  return results;
}

module.exports = { syncLeetCode, syncAllPlatforms };
