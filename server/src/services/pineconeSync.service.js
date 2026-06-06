const { getEmbeddings } = require("./ai/embeddings.service");
const { getPineconeIndex } = require("../config/pinecone");

const NAMESPACE = "daily-problems";

async function upsertProblemInPinecone(problem) {
  const pineconeIndex = await getPineconeIndex();
  if (!pineconeIndex) return;

  const embeddings = getEmbeddings();
  const text = `${problem.title}. Topics: ${problem.topics.join(", ")}. Difficulty: ${problem.difficulty}.`;
  const embedding = await embeddings.embedQuery(text);

  await pineconeIndex.namespace(NAMESPACE).upsert([
    {
      id: `problem-${problem.slug}`,
      values: embedding,
      metadata: {
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        topics: JSON.stringify(problem.topics),
        sourceUrl: problem.sourceUrl || "",
        sourceLabel: problem.sourceLabel || "LeetCode",
      },
    },
  ]);
}

async function removeProblemFromPinecone(slug) {
  const pineconeIndex = await getPineconeIndex();
  if (!pineconeIndex) return;

  try {
    await pineconeIndex.namespace(NAMESPACE).deleteOne(`problem-${slug}`);
  } catch {
    // vector may not exist; ignore
  }
}

async function syncAllProblemsToPinecone() {
  const Problem = require("../models/Problem");
  const problems = await Problem.find().select("title slug difficulty topics sourceUrl sourceLabel").lean();

  const pineconeIndex = await getPineconeIndex();
  if (!pineconeIndex) throw new Error("Pinecone not configured");

  try {
    await pineconeIndex.namespace(NAMESPACE).deleteAll();
  } catch {
    // namespace may not exist yet
  }

  const embeddings = getEmbeddings();
  const batchSize = 10;

  for (let i = 0; i < problems.length; i += batchSize) {
    const batch = problems.slice(i, i + batchSize);
    const vectors = await Promise.all(
      batch.map(async (p) => {
        const text = `${p.title}. Topics: ${p.topics.join(", ")}. Difficulty: ${p.difficulty}.`;
        const embedding = await embeddings.embedQuery(text);
        return {
          id: `problem-${p.slug}`,
          values: embedding,
          metadata: {
            title: p.title,
            slug: p.slug,
            difficulty: p.difficulty,
            topics: JSON.stringify(p.topics),
            sourceUrl: p.sourceUrl || "",
            sourceLabel: p.sourceLabel || "LeetCode",
          },
        };
      })
    );
    await pineconeIndex.namespace(NAMESPACE).upsert(vectors);
  }

  return problems.length;
}

module.exports = { upsertProblemInPinecone, removeProblemFromPinecone, syncAllProblemsToPinecone };
