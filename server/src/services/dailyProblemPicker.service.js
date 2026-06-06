const { PineconeStore } = require("@langchain/pinecone");
const { getEmbeddings, getLLM } = require("./ai/embeddings.service");
const { getPineconeIndex } = require("../config/pinecone");
const User = require("../models/User");
const Progress = require("../models/Progress");
const Problem = require("../models/Problem");
const { getWeakTopics } = require("./analytics.service");

const NAMESPACE = "daily-problems";

function isToday(date) {
  if (!date) return false;
  const now = new Date();
  const d = new Date(date);
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
}

function scoreCandidate(problem, weakTopics, totalSolved) {
  let score = 0;
  for (const wt of weakTopics) {
    if (problem.topics.some((t) => t.toLowerCase().includes(wt.topic.toLowerCase()) || wt.topic.toLowerCase().includes(t.toLowerCase()))) {
      score += 2;
    }
  }
  if (totalSolved < 20) {
    if (problem.difficulty === "Easy") score += 1;
    else if (problem.difficulty === "Medium") score += 0.5;
  } else if (totalSolved < 80) {
    if (problem.difficulty === "Medium") score += 1;
    else if (problem.difficulty === "Easy") score += 0.5;
  } else {
    if (problem.difficulty === "Medium" || problem.difficulty === "Hard") score += 1;
  }
  return score;
}

async function generateReason(problem, weakTopics, totalSolved) {
  const llm = getLLM();
  const weakStr = weakTopics.length > 0 ? weakTopics.map((t) => t.topic).join(", ") : "general DSA";
  const prompt = `Generate one short encouraging sentence (max 15 words) explaining why "${problem.title}" (${problem.difficulty}, topics: ${problem.topics.join(", ")}) was picked for today. The user's weak areas include: ${weakStr}. They've solved ${totalSolved} problems. No quotes, just the sentence.`;
  try {
    const result = await llm.invoke(prompt);
    return (result.content || "").replace(/[""]/g, "").trim();
  } catch {
    const topic = problem.topics[0] || "algorithms";
    return `A great ${problem.difficulty.toLowerCase()} problem to strengthen your ${topic} skills today.`;
  }
}

async function selectProblem(userId) {
  const weakTopics = await getWeakTopics(userId);
  const progressDocs = await Progress.find({ userId }).populate("problemId", "slug").lean();
  const solvedSlugs = new Set(
    progressDocs
      .filter((p) => p.problemId)
      .map((p) => p.problemId.slug)
  );
  const totalSolved = progressDocs.filter((p) => p.status === "solved").length;

  let candidates = [];
  let fromPinecone = false;

  try {
    const pineconeIndex = await getPineconeIndex();
    if (pineconeIndex) {
      const embeddings = getEmbeddings();
      const vectorStore = new PineconeStore(embeddings, {
        pineconeIndex,
        namespace: NAMESPACE,
      });
      const retriever = vectorStore.asRetriever(20);
      const queryText = weakTopics.length > 0
        ? weakTopics.map((t) => t.topic).join(" ")
        : "data structures algorithms programming";
      const docs = await retriever.invoke(queryText);
      for (const doc of docs) {
        const meta = doc.metadata;
        if (!meta || solvedSlugs.has(meta.slug)) continue;
        candidates.push({
          title: meta.title,
          slug: meta.slug,
          difficulty: meta.difficulty,
          topics: typeof meta.topics === "string" ? JSON.parse(meta.topics) : meta.topics,
          sourceUrl: meta.sourceUrl,
          sourceLabel: meta.sourceLabel,
        });
      }
      fromPinecone = candidates.length > 0;
    }
  } catch {
    // Pinecone unavailable; fall through to DB
  }

  if (!fromPinecone) {
    candidates = await Problem.find({ slug: { $nin: [...solvedSlugs] } })
      .select("title slug difficulty topics sourceUrl sourceLabel")
      .lean();

    if (candidates.length === 0) {
      candidates = await Problem.find().select("title slug difficulty topics sourceUrl sourceLabel").limit(1).lean();
      if (candidates.length === 0) {
        throw new Error("No problems exist in the database to pick a daily problem.");
      }
    }
  }

  const scored = candidates
    .map((p) => ({ ...p, score: scoreCandidate(p, weakTopics, totalSolved) }))
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug));

  const matchedWeakTopic = weakTopics.find((wt) =>
    scored[0].topics.some(
      (t) => t.toLowerCase().includes(wt.topic.toLowerCase()) || wt.topic.toLowerCase().includes(t.toLowerCase())
    )
  );
  const weakestTopic = matchedWeakTopic?.topic || null;
  console.log('[dailyProblem] source:', fromPinecone ? 'Pinecone' : 'DB fallback', '| candidates:', candidates.length, '| winner:', scored[0]?.slug, '| weakTopics:', weakTopics.map(w => w.topic).join(','));
  return { problem: scored[0], weakestTopic, weakTopics, totalSolved };
}

async function getDailyProblem(userId) {
  const user = await User.findById(userId).select("dailyProblem").lean();
  const cached = user?.dailyProblem?.pickedAt && isToday(user.dailyProblem.pickedAt);
  console.log('[dailyProblem] called | cached:', cached, '| cachedSlug:', user?.dailyProblem?.problemSlug);
  if (cached) {
    const exists = await Problem.exists({ slug: user.dailyProblem.problemSlug });
    if (!exists) {
      const { problem, weakestTopic, weakTopics, totalSolved } = await selectProblem(userId);
      const reason = await generateReason(problem, weakTopics, totalSolved);
      const dailyProblem = {
        problemTitle: problem.title,
        problemSlug: problem.slug,
        difficulty: problem.difficulty,
        topics: problem.topics,
        sourceUrl: problem.sourceUrl,
        sourceLabel: problem.sourceLabel || "LeetCode",
        weakestTopic,
        reason,
        pickedAt: new Date(),
      };
      await User.findByIdAndUpdate(userId, { dailyProblem });
      return dailyProblem;
    }
    const dailyProblem = { ...user.dailyProblem };
    const weakTopics = await getWeakTopics(userId);
    const totalSolved = await Progress.countDocuments({ userId, status: "solved" });
    const matchedWeakTopic = weakTopics.find((wt) =>
      (dailyProblem.topics || []).some(
        (t) => t.toLowerCase().includes(wt.topic.toLowerCase()) || wt.topic.toLowerCase().includes(t.toLowerCase())
      )
    );
    const correctedWeakest = matchedWeakTopic?.topic || null;
    if (!dailyProblem.reason || dailyProblem.weakestTopic !== correctedWeakest) {
      dailyProblem.reason = dailyProblem.reason || await generateReason(
        { title: dailyProblem.problemTitle, difficulty: dailyProblem.difficulty, topics: dailyProblem.topics },
        weakTopics,
        totalSolved
      );
      dailyProblem.weakestTopic = correctedWeakest;
      await User.findByIdAndUpdate(userId, { dailyProblem });
    }
    return dailyProblem;
  }
  const { problem, weakestTopic, weakTopics, totalSolved } = await selectProblem(userId);
  const reason = await generateReason(problem, weakTopics, totalSolved);
  const dailyProblem = {
    problemTitle: problem.title,
    problemSlug: problem.slug,
    difficulty: problem.difficulty,
    topics: problem.topics,
    sourceUrl: problem.sourceUrl,
    sourceLabel: problem.sourceLabel || "LeetCode",
    weakestTopic,
    reason,
    pickedAt: new Date(),
  };
  await User.findByIdAndUpdate(userId, { dailyProblem });
  return dailyProblem;
}

async function refreshDailyProblem(userId) {
  const { problem, weakestTopic, weakTopics, totalSolved } = await selectProblem(userId);
  const reason = await generateReason(problem, weakTopics, totalSolved);
  const dailyProblem = {
    problemTitle: problem.title,
    problemSlug: problem.slug,
    difficulty: problem.difficulty,
    topics: problem.topics,
    sourceUrl: problem.sourceUrl,
    sourceLabel: problem.sourceLabel || "LeetCode",
    weakestTopic,
    reason,
    pickedAt: new Date(),
  };
  await User.findByIdAndUpdate(userId, { dailyProblem });
  return dailyProblem;
}

module.exports = { getDailyProblem, refreshDailyProblem };
