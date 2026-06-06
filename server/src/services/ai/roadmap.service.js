const { PineconeStore } = require("@langchain/pinecone");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { JsonOutputParser } = require("@langchain/core/output_parsers");
const { getEmbeddings, getLLM } = require("./embeddings.service");
const { getPineconeIndex } = require("../../config/pinecone");
const Roadmap = require("../../models/Roadmap");

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

Return a JSON object with a single key "weeks" containing an array of objects. Each object must have:
- weekNumber: number (1-based)
- theme: string
- topics: array of strings
- goals: array of strings
- checkpoints: array of strings

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
    const pineconeIndex = await getPineconeIndex();
    if (pineconeIndex) {
      const vectorStore = new PineconeStore(embeddings, { pineconeIndex });
      const retriever = vectorStore.asRetriever(10);
      const docs = await retriever.invoke(weakTopicsStr);
      context = formatDocs(docs);
    }
  } catch {
    context = "No additional context available.";
  }

  const userContext = context
    ? `Retrieved DSA context:\n${context}`
    : "No additional context available.";

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["human", "Generate a {weekCount}-week DSA study roadmap for a {currentLevel} learner targeting {targetRole}. Weak areas: {weakTopics}.\n\n{userContext}"],
  ]);

  const chain = prompt.pipe(llm).pipe(new JsonOutputParser());

  const result = await chain.invoke({
    currentLevel,
    weakTopics: weakTopicsStr,
    targetRole,
    duration,
    weekCount,
    userContext,
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
