const { PineconeStore } = require("@langchain/pinecone");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { JsonOutputParser } = require("@langchain/core/output_parsers");
const { getEmbeddings, getLLM } = require("./embeddings.service");
const { getPineconeIndex } = require("../../config/pinecone");
const Roadmap = require("../../models/Roadmap");
const progressService = require("../progress.service");

const weekCountMap = { 30: 4, 60: 8, 90: 12 };
const STANDARD_TOPICS = [
  'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs',
  'Dynamic Programming', 'Sorting', 'Binary Search', 'Heaps',
  'Hash Tables', 'Recursion', 'Greedy', 'Sliding Window',
  'Two Pointers', 'Stack', 'Queue', 'Math', 'Backtracking',
];

function formatDocs(docs) {
  return docs.map((d) => d.pageContent).join("\n\n---\n\n");
}

function detectWeakAndStrongFromAnalytics(solvedPerTopic, totalSolved) {
  if (totalSolved === 0) return { detectedWeak: [], detectedStrong: [] };

  const withCounts = STANDARD_TOPICS.map((t) => ({
    topic: t,
    solved: solvedPerTopic[t] || 0,
  }));

  const sorted = [...withCounts].sort((a, b) => a.solved - b.solved);
  const weakThreshold = Math.max(1, Math.ceil(totalSolved / STANDARD_TOPICS.length));

  const detectedWeak = sorted
    .filter((t) => t.solved <= weakThreshold)
    .map((t) => t.topic);

  const detectedStrong = sorted
    .filter((t) => t.solved > weakThreshold)
    .map((t) => t.topic);

  return { detectedWeak, detectedStrong };
}

async function generateRoadmap({ weakTopics, strongTopics, mode, targetRole, duration, currentLevel, userId }) {
  if (![30, 60, 90].includes(duration)) {
    throw new Error("duration must be 30, 60, or 90");
  }

  const weekCount = weekCountMap[duration];
  const embeddings = getEmbeddings();
  const llm = getLLM();

  let analyticsContext = "";
  let finalWeakTopics = [...(Array.isArray(weakTopics) ? weakTopics : [])];
  const finalStrongTopics = Array.isArray(strongTopics) ? strongTopics : [];

  if (mode === "analytics" || mode === "hybrid") {
    try {
      const { solvedPerTopic, totalSolved } = await progressService.getAnalyticsSummary(userId);

      if (totalSolved >= 20) {
        const { detectedWeak, detectedStrong } = detectWeakAndStrongFromAnalytics(solvedPerTopic, totalSolved);

        const strongSet = new Set(finalStrongTopics);

        if (mode === "analytics") {
          finalWeakTopics = detectedWeak.filter((t) => !strongSet.has(t));
        } else {
          const userWeakSet = new Set(finalWeakTopics);
          for (const t of detectedWeak) {
            if (!strongSet.has(t)) userWeakSet.add(t);
          }
          finalWeakTopics = Array.from(userWeakSet);
        }

        const topicBreakdown = STANDARD_TOPICS.map((t) => {
          const count = solvedPerTopic[t] || 0;
          const label = detectedWeak.includes(t) ? "weak" : detectedStrong.includes(t) ? "strong" : "moderate";
          return `  - ${t}: ${count} solved (${label})`;
        }).join("\n");

        analyticsContext = [
          `Analytics summary (${totalSolved} total solved problems):`,
          topicBreakdown,
          "",
          `Detected weak topics: ${detectedWeak.join(", ") || "none"}`,
          `Detected strong topics: ${detectedStrong.join(", ") || "none"}`,
        ].join("\n");
      }
    } catch {
      analyticsContext = "Analytics data unavailable.";
    }
  }

  const finalWeakStr = finalWeakTopics.length > 0
    ? finalWeakTopics.join(", ")
    : "general DSA preparation";

  const strongStr = finalStrongTopics.length > 0
    ? `Their stronger topics: ${finalStrongTopics.join(", ")}. Spend less time reinforcing these.`
    : "";

  let context = "";
  try {
    const pineconeIndex = await getPineconeIndex();
    if (pineconeIndex) {
      const vectorStore = new PineconeStore(embeddings, { pineconeIndex });
      const retriever = vectorStore.asRetriever(10);
      const docs = await retriever.invoke(finalWeakStr);
      context = formatDocs(docs);
    }
  } catch {
    context = "No additional context available.";
  }

  const userContext = context
    ? `Retrieved DSA context:\n${context}`
    : "No additional context available.";

  const systemTemplate = [
    "You are CodePrep AI, a senior DSA curriculum designer. Create a personalized weekly study roadmap based on the user's profile and context below.",
    "",
    `Current level: ${currentLevel}`,
    `Focus topics: ${finalWeakStr}`,
    strongStr,
    `Target role: ${targetRole}`,
    `Duration: ${duration} days (${weekCount} weeks)`,
    "",
    analyticsContext,
    "",
    "Rules:",
    `- Create exactly ${weekCount} weeks of study plan.`,
    "- Each week must have a clear theme, specific topics, concrete goals, and measurable checkpoints.",
    "- Progress from fundamentals to advanced topics over the weeks.",
    "- Focus on weak/less-solved topics while building toward interview readiness for the target role.",
    "- Do NOT spend excessive time on topics the user is already strong in.",
    "",
    'Return a JSON object with a single key "weeks" containing an array of objects. Each object must have:',
    "- weekNumber: number (1-based)",
    "- theme: string",
    "- topics: array of strings",
    "- goals: array of strings",
    "- checkpoints: array of strings",
    "",
    "Return ONLY valid JSON. No markdown, no explanation.",
  ].filter(Boolean).join("\n");

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["human", "Generate a {weekCount}-week DSA study roadmap for a {currentLevel} learner targeting {targetRole}. Weak areas: {finalWeakStr}.\n\n{userContext}"],
  ]);

  const chain = prompt.pipe(llm).pipe(new JsonOutputParser());

  const result = await chain.invoke({
    currentLevel,
    finalWeakStr,
    targetRole,
    duration,
    weekCount,
    userContext,
  });

  const roadmap = await Roadmap.create({
    userId,
    weakTopics: finalWeakTopics,
    strongTopics: finalStrongTopics,
    mode: mode || "manual",
    targetRole,
    duration,
    currentLevel,
    weeks: result.weeks,
  });

  return roadmap;
}

async function getRoadmap(userId) {
  const roadmap = await Roadmap.findOne({ userId }).sort({ createdAt: -1 });
  return roadmap;
}

module.exports = { generateRoadmap, getRoadmap };