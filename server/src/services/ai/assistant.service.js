const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { RunnablePassthrough } = require("@langchain/core/runnables");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");
const { getEmbeddings, getLLM } = require("./embeddings.service");

const COLLECTION_NAME = "dsa_knowledge_base";

const systemPrompt = `You are CodePrep AI, a senior DSA mentor. Answer the user's question using ONLY the context provided below.

Rules:
- If the context does not contain enough information to answer, admit that you don't know.
- Never hallucinate algorithms, time complexities, data structures, or problem solutions.
- Base your answer strictly on the retrieved DSA knowledge.
- Be concise, clear, and educational.
- Use code examples only when they appear in the retrieved context.

Retrieved context:
{context}`;

function formatDocs(docs) {
  return docs.map((d) => d.pageContent).join("\n\n---\n\n");
}

async function getAssistantResponse({ message, chatHistory }) {
  const embeddings = getEmbeddings();
  const llm = getLLM();

  const vectorStore = new Chroma(embeddings, {
    collectionName: COLLECTION_NAME,
  });

  const retriever = vectorStore.asRetriever(5);

  const formattedHistory = (chatHistory || [])
    .filter((m) => m.role && m.content)
    .map((m) => {
      if (m.role === "assistant") return new AIMessage(m.content);
      return new HumanMessage(m.content);
    });

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["placeholder", "{chatHistory}"],
    ["human", "{question}"],
  ]);

  const chain = RunnablePassthrough.assign({
    context: (input) => retriever.pipe(formatDocs).invoke(input.question),
  }).pipe(prompt).pipe(llm).pipe(new StringOutputParser());

  const response = await chain.invoke({
    question: message,
    chatHistory: formattedHistory,
  });

  return response;
}

async function streamAssistantResponse({ message, chatHistory }) {
  const embeddings = getEmbeddings();
  const llm = getLLM();

  const vectorStore = new Chroma(embeddings, {
    collectionName: COLLECTION_NAME,
  });

  const retriever = vectorStore.asRetriever(5);

  const formattedHistory = (chatHistory || [])
    .filter((m) => m.role && m.content)
    .map((m) => {
      if (m.role === "assistant") return new AIMessage(m.content);
      return new HumanMessage(m.content);
    });

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["placeholder", "{chatHistory}"],
    ["human", "{question}"],
  ]);

  const chain = RunnablePassthrough.assign({
    context: (input) => retriever.pipe(formatDocs).invoke(input.question),
  }).pipe(prompt).pipe(llm).pipe(new StringOutputParser());

  return chain.stream({
    question: message,
    chatHistory: formattedHistory,
  });
}

module.exports = { getAssistantResponse, streamAssistantResponse };
