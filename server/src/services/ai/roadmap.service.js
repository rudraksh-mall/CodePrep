const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { JsonOutputParser } = require("@langchain/core/output_parsers");
const { getEmbeddings, getLLM } = require("./embeddings.service");
const Roadmap = require("../../models/Roadmap");

const COLLECTION_NAME = "dsa_knowledge_base";

const weekCountMap = { 30: 4, 60: 8, 90: 12 };

function formatDocs(docs) {
  return docs.map((d) => d.pageContent).join("\n\n---\n\n");
}

const systemTemplate = `You are CodePrep AI, a senior DSA curriculum designer. Create a personalized weekly study roadmap based on the user's profile and the retrieved DSA knowledge context below.

User profile:
- Current level: {currentLevel}
- Weak topics: {weakTopics}
- Target role: {targetRole}
- Duration: {duration} days ({weekCount} weeks)

Rules:
- Create exactly {weekCount} weeks of study plan.
- Each week must have a clear theme, specific topics, concrete goals, and measurable checkpoints.
- Progress from fundamentals to advanced topics over the weeks.
- Focus on the user's weak topics while building toward interview readiness for the target role.
- Base the roadmap on the retrieved DSA context when applicable.
- If a weak topic is not covered by the context, use your general DSA knowledge to fill gaps.

Return a JSON object with a single key "weeks" containing an array of objects. Each object must have:
- weekNumber: number (1-based)
- theme: string — the overarching theme for the week
- topics: array of strings — specific topics and algorithms to study
- goals: array of strings — 2-3 learning goals for the week
- checkpoints: array of strings — 2-3 ways to verify progress (e.g., "Solve 3 problems on LeetCode")

Return ONLY valid JSON. No markdown, no explanation.`;

async function generateRoadmap({ weakTopics, targetRole, duration, currentLevel, userId }) {
  if (![30, 60, 90].includes(duration)) {
    throw new Error("duration must be 30, 60, or 90");
  }

  const weekCount = weekCountMap[duration];
  const embeddings = getEmbeddings();
  const llm = getLLM();

  const weakTopicsStr = Array.isArray(weakTopics) && weakTopics.length > 0
    ? weakTopics.join(", ")
    : "general DSA preparation";

  let context = "";
  try {
    const vectorStore = new Chroma(embeddings, {
      collectionName: COLLECTION_NAME,
    });

    const retriever = vectorStore.asRetriever(10);
    const docs = await retriever.invoke(weakTopicsStr);
    context = formatDocs(docs);
  } catch {
    context = "No additional context available.";
  }

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    [
      "human",
      "Generate a {weekCount}-week DSA study roadmap for a {currentLevel} learner targeting {targetRole}. Weak areas: {weakTopics}.",
    ],
  ]);

  const chain = prompt.pipe(llm).pipe(new JsonOutputParser());

  const result = await chain.invoke({
    currentLevel,
    weakTopics: weakTopicsStr,
    targetRole,
    duration,
    weekCount,
  });

  const roadmap = await Roadmap.create({
    userId,
    weakTopics: Array.isArray(weakTopics) ? weakTopics : [],
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
