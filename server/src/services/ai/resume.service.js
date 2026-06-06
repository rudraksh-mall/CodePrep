const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { JsonOutputParser } = require("@langchain/core/output_parsers");
const { getLLM } = require("./embeddings.service");
const { extractTextFromBuffer } = require("../../utils/pdfParser");
const Resume = require("../../models/Resume");
const InterviewQuestion = require("../../models/InterviewQuestion");

const MAX_TEXT_LENGTH = 8000;

const systemTemplate = `You are CodePrep AI, a senior technical recruiter and resume analyst. Your job is to extract structured information from a candidate's resume.

Analyze the resume text below and return a JSON object with these fields:
- extractedSkills: array of strings — all technical and professional skills mentioned
- experience: array of objects, each with:
  - title: string — job title
  - company: string — company name
  - duration: string — date range or duration
  - description: string — brief summary of responsibilities and achievements
- education: array of objects, each with:
  - degree: string — degree name
  - institution: string — school or university name
  - year: string — graduation year or date range

Return ONLY valid JSON. No markdown, no explanation.`;

async function analyzeResume(pdfBuffer) {
  const rawText = await extractTextFromBuffer(pdfBuffer);
  const truncated = rawText.slice(0, MAX_TEXT_LENGTH);

  const llm = getLLM();
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["human", "Resume text:\n{resumeText}"],
  ]);

  const chain = prompt.pipe(llm).pipe(new JsonOutputParser());

  const extractedData = await chain.invoke({ resumeText: truncated });

  return { extractedData, rawText };
}

async function saveResumeAnalysis({ userId, fileName, rawText, extractedData }) {
  const resume = await Resume.create({ userId, fileName, rawText, extractedData });
  return resume;
}

async function getLatestResumeAnalysis(userId) {
  const resume = await Resume.findOne({ userId }).sort({ createdAt: -1 });
  if (!resume) return null;

  const interviewQuestion = await InterviewQuestion.findOne({
    userId,
    resumeId: resume._id,
  }).sort({ createdAt: -1 });

  return {
    resumeId: resume._id,
    fileName: resume.fileName,
    targetRole: interviewQuestion?.targetRole || null,
    extractedSkills: resume.extractedData?.extractedSkills || [],
    questions: interviewQuestion?.questions || [],
    createdAt: resume.createdAt,
    questionsCreatedAt: interviewQuestion?.createdAt || null,
  };
}

module.exports = { analyzeResume, saveResumeAnalysis, getLatestResumeAnalysis };
