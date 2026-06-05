const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { getLLM } = require("./embeddings.service");

const levelInstructions = {
  1: "Provide a conceptual nudge — mention the category or high-level approach that applies to this problem. Do NOT give any algorithm name, data structure, or code.",
  2: "Provide an algorithmic hint — suggest the algorithm pattern or data structure that would work, but do NOT write any actual code or pseudo-code.",
  3: "Provide detailed guidance — walk through the logical steps to solve the problem, mention edge cases to consider, but do NOT write any actual code or pseudo-code.",
};

const systemTemplate = `You are CodePrep AI, a senior software engineering mentor. Your job is to guide users toward solving coding problems themselves.

Rules:
- Never write actual code, pseudo-code, or executable logic.
- Never give away the complete solution.
- Encourage the user to think critically.
- Be concise but helpful.

The problem title is: {problemTitle}
The problem description is: {problemDescription}`;

async function generateHint({ problemTitle, problemDescription, hintLevel }) {
  const llm = getLLM();
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["human", "{instruction}"],
  ]);

  const instruction = levelInstructions[hintLevel];

  const chain = prompt.pipe(llm).pipe(new StringOutputParser());

  const hint = await chain.invoke({
    problemTitle,
    problemDescription,
    instruction,
  });

  return { hint, level: hintLevel };
}

module.exports = { generateHint };
