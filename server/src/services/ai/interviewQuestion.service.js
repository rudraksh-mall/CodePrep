const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { JsonOutputParser } = require("@langchain/core/output_parsers");
const { getLLM } = require("./embeddings.service");
const InterviewQuestion = require("../../models/InterviewQuestion");

const systemTemplate = `You are CodePrep AI, a senior technical interviewer. Your job is to generate interview questions tailored to a candidate's skills and target role.

Rules:
- Questions must be realistic and at appropriate difficulty for the role.
- Never ask about the same concept twice.
- Cover a broad range of topics from the candidate's skill set.

Generate exactly {questionCount} questions with this category split:
- 60% technical (specific technical skills, languages, frameworks, tools)
- 20% behavioral (soft skills, teamwork, conflict resolution, leadership)
- 20% system design (architecture, scalability, trade-offs, design decisions)

Return a JSON object with a single key "questions" containing an array of objects. Each object must have:
- question: string — the full interview question
- category: string — "technical", "behavioral", or "system design"
- difficulty: string — "easy", "medium", or "hard"
- skill: string — the specific skill or topic this question targets

Return ONLY valid JSON. No markdown, no explanation.`;

async function generateQuestions({ extractedSkills, targetRole, questionCount = 15 }) {
  const llm = getLLM();
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    [
      "human",
      "Target role: {targetRole}\nCandidate skills: {skills}\nGenerate {questionCount} questions following the specified category split.",
    ],
  ]);

  const chain = prompt.pipe(llm).pipe(new JsonOutputParser());

  const skills = Array.isArray(extractedSkills) ? extractedSkills.join(", ") : "";

  const result = await chain.invoke({
    targetRole,
    skills,
    questionCount: String(questionCount),
  });

  return result.questions;
}

async function saveQuestions({ userId, resumeId, targetRole, questions }) {
  const doc = await InterviewQuestion.create({ userId, resumeId, targetRole, questions });
  return doc;
}

module.exports = { generateQuestions, saveQuestions };
