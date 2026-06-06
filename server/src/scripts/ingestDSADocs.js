require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { PineconeStore } = require("@langchain/pinecone");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { openrouterApiKey } = require("../config/env");
const { getPineconeIndex, deleteAllVectors, INDEX_NAME } = require("../config/pinecone");

const DOCS_DIR = path.resolve(__dirname, "../data/dsa_docs");

async function ingestDSADocs() {
  if (!openrouterApiKey) {
    console.error("OPENROUTER_API_KEY is required. Set it in .env.");
    process.exit(1);
  }

  const files = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith(".md"));

  if (files.length === 0) {
    console.error("No markdown files found in", DOCS_DIR);
    process.exit(1);
  }

  console.log(`Found ${files.length} markdown files in ${DOCS_DIR}`);

  const allDocs = [];

  for (const file of files) {
    const filePath = path.join(DOCS_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const topic = path.basename(file, ".md");

    allDocs.push({
      pageContent: content,
      metadata: { source: file, topic },
    });
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splitDocs = await splitter.splitDocuments(allDocs);

  console.log(`Split into ${splitDocs.length} chunks`);

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    apiKey: openrouterApiKey,
    configuration: { baseURL: "https://openrouter.ai/api/v1" },
  });

  const pineconeIndex = await getPineconeIndex();
  await deleteAllVectors();

  await PineconeStore.fromDocuments(splitDocs, embeddings, { pineconeIndex });

  console.log(`Successfully ingested ${splitDocs.length} chunks into Pinecone index "${INDEX_NAME}"`);
}

ingestDSADocs().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
