const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { JsonOutputParser } = require("@langchain/core/output_parsers");
const { getLLM } = require("./embeddings.service");
const InterviewSession = require("../../models/InterviewSession");
const MockInterviewResume = require("../../models/MockInterviewResume");
const { analyzeResume } = require("./resume.service");

const QUESTION_COUNT_MAP = { 15: 3, 30: 5, 45: 7 };

const conversationSystemTemplate = `You are CodePrep AI, a senior technical interviewer conducting a live voice interview. You are speaking directly to the candidate. Your tone is professional, engaging, and natural — like a real interviewer at a top tech company.

INTERVIEW STYLE:
- Start with an opening question to warm up.
- After the candidate answers, ask a natural follow-up that digs deeper.
- Reference what the candidate just said ("You mentioned X — can you elaborate?")
- Challenge weak or vague answers politely.
- Keep the conversation flowing like a real back-and-forth.
- Vary question difficulty: start easy, gradually get harder.
- For each exchange, ask ONE question at a time. Do not ask multiple questions in one message.

For DSA: Ask about data structures, algorithms, complexity, trade-offs, real-world applications.
For Behavioral: Ask about past experiences, teamwork, conflict, leadership decisions.
For Resume-Based: Reference the candidate's skills and past projects from their resume.
For Mixed: Rotate naturally between technical, behavioral, and resume topics.

RULES:
- Ask conceptual questions, NOT coding problems. No code snippets.
- Be concise — keep each interviewer message to 1-3 sentences.
- Never repeat the same question.
- If the candidate's answer is weak, ask a more specific follow-up to probe understanding.`;

const evaluationSystemTemplate = `You are CodePrep AI, a senior technical interviewer evaluating a candidate's spoken answer.

Evaluate the candidate's answer based on:
1. Technical Accuracy — correctness and depth of technical knowledge
2. Completeness — how thoroughly the question was addressed
3. Clarity — how clearly and coherently the answer was expressed
4. Communication — overall verbal communication quality
5. Problem Solving — how well the candidate structures their thinking
6. Confidence — how assured and decisive the answer sounds

Be honest and constructive. Identify specific strengths and actionable improvements.

Return a JSON object with:
- score: number (0-100) — overall score
- technicalAccuracy: number (0-100)
- communication: number (0-100)
- problemSolving: number (0-100)
- confidence: number (0-100)
- strengths: array of strings — specific things the candidate did well
- improvements: array of strings — specific areas to improve

Return ONLY valid JSON. No markdown, no explanation.`;

const reportSystemTemplate = `You are CodePrep AI, generating a final interview performance report.

Analyze all the questions, answers, and scores from this interview session.
Identify patterns in the candidate's performance.

Return a JSON object with:
- overallScore: number (0-100) — weighted average of all question scores
- technicalAccuracy: number (0-100) — average technical accuracy across technical questions
- communication: number (0-100) — average communication score across all questions
- problemSolving: number (0-100) — average problem solving score
- confidence: number (0-100) — average confidence score
- strengths: array of strings — top 3-5 key strengths demonstrated
- improvements: array of strings — top 3-5 areas to improve
- recommendedTopics: array of strings — 3-5 topics or skills the candidate should study further

Return ONLY valid JSON. No markdown, no explanation.`;

function getQuestionCount(duration) {
  return QUESTION_COUNT_MAP[duration] || 4;
}

async function getResumeContext(userId, interviewType) {
  if (interviewType !== "Resume-Based" && interviewType !== "Mixed") return "";

  try {
    const resume = await MockInterviewResume.findOne({ userId }).sort({ createdAt: -1 }).lean();
    if (resume?.extractedData) {
      const skills = resume.extractedData.extractedSkills || [];
      const roles = (resume.extractedData.experience || []).map((e) => `- ${e.title} at ${e.company}`).join("\n");
      return `Candidate's background:\nSkills: ${skills.join(", ")}\nExperience:\n${roles}`;
    }
  } catch {
    // resume unavailable
  }
  return "";
}

async function uploadMockResume({ userId, buffer, fileName }) {
  const { extractedData, rawText } = await analyzeResume(buffer);
  const resume = await MockInterviewResume.create({ userId, fileName, rawText, extractedData });
  return { resumeId: resume._id, fileName: resume.fileName, extractedData };
}

async function getLatestMockResume(userId) {
  const resume = await MockInterviewResume.findOne({ userId }).sort({ createdAt: -1 }).lean();
  if (!resume) return null;
  return {
    resumeId: resume._id,
    fileName: resume.fileName,
    extractedSkills: resume.extractedData?.extractedSkills || [],
    createdAt: resume.createdAt,
  };
}

function formatConversationHistory(conversation) {
  return conversation
    .map((c) => {
      const prefix = c.role === "interviewer" ? "Interviewer" : "Candidate";
      return `${prefix}: ${c.message}`;
    })
    .join("\n\n");
}

async function generateOpeningQuestion({ userId, interviewType, resumeContext }) {
  const llm = getLLM();

  const typeInstruction = {
    DSA: "Ask about data structures, algorithms, complexity, or trade-offs. Start with a warm-up question.",
    "Resume-Based": "Ask about a specific project, technology, or skill from the candidate's resume. Start with something approachable.",
    Behavioral: "Ask a behavioral warm-up question about a past experience.",
    Mixed: "Start with a general technical question.",
  };

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", conversationSystemTemplate],
    [
      "human",
      `Interview type: ${interviewType}
${typeInstruction[interviewType] || ""}
${resumeContext ? resumeContext + "\n" : ""}
This is the very first question. Introduce yourself briefly and ask an opening question.

Return a JSON object with:
- message: string — what the interviewer says (introduction + question)
- type: "technical" | "behavioral" | "system design" | "resume"
- topic: string — the specific topic or skill area

Return ONLY valid JSON. No markdown, no explanation.`,
    ],
  ]);

  const chain = prompt.pipe(llm).pipe(new JsonOutputParser());
  const result = await chain.invoke({ interviewType, typeInstruction, resumeContext });

  return {
    message: result.message || "Tell me about a challenging technical problem you've solved.",
    type: result.type || "technical",
    topic: result.topic || "General",
  };
}

async function generateFollowUp({ interviewType, conversation, resumeContext }) {
  const llm = getLLM();
  const history = formatConversationHistory(conversation);

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", conversationSystemTemplate],
    [
      "human",
      `Interview type: ${interviewType}
${resumeContext ? resumeContext + "\n" : ""}
Conversation so far:
${history}

Continue the interview naturally. Ask ONE follow-up question that:
- References something the candidate just said if possible
- Digs deeper into their knowledge
- Challenges vague answers
- Moves to a new topic if the current one is exhausted

Return a JSON object with:
- message: string — what the interviewer says next (just the question, no introduction)
- type: "technical" | "behavioral" | "system design" | "resume"
- topic: string — the specific topic or skill area
- isFollowUp: boolean — true if this is a direct follow-up to the last answer, false if moving to a new topic

Return ONLY valid JSON. No markdown, no explanation.`,
    ],
  ]);

  const chain = prompt.pipe(llm).pipe(new JsonOutputParser());
  const result = await chain.invoke({ interviewType, history, resumeContext });

  return {
    message: result.message || "Can you elaborate on that?",
    type: result.type || "technical",
    topic: result.topic || "General",
    isFollowUp: result.isFollowUp !== false,
  };
}

async function evaluateAnswer({ questionData, answer }) {
  const llm = getLLM();

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", evaluationSystemTemplate],
    [
      "human",
      `Question: ${questionData.question}
Question type: ${questionData.type}
Question topic: ${questionData.topic || "General"}

Candidate's answer:
${answer}

Evaluate this answer thoroughly.`,
    ],
  ]);

  const chain = prompt.pipe(llm).pipe(new JsonOutputParser());
  const result = await chain.invoke({ questionData, answer });

  return {
    score: Math.min(100, Math.max(0, result.score || 50)),
    technicalAccuracy: Math.min(100, Math.max(0, result.technicalAccuracy || result.score || 50)),
    communication: Math.min(100, Math.max(0, result.communication || result.score || 50)),
    problemSolving: Math.min(100, Math.max(0, result.problemSolving || result.score || 50)),
    confidence: Math.min(100, Math.max(0, result.confidence || result.score || 50)),
    strengths: result.strengths || [],
    improvements: result.improvements || [],
  };
}

async function generateFinalReport(questions) {
  const llm = getLLM();

  const sessionData = questions
    .filter((q) => q.answer)
    .map(
      (q, i) =>
        `Q${i + 1} (${q.questionType}, ${q.topic || "general"}) [Score: ${q.score ?? "N/A"}]:\nQuestion: ${q.question}\nAnswer: ${q.answer}\nStrengths: ${(q.strengths || []).join(", ")}\nImprovements: ${(q.improvements || []).join(", ")}`
    )
    .join("\n\n");

  if (!sessionData) {
    return {
      overallScore: 0, technicalAccuracy: 0, communication: 0,
      problemSolving: 0, confidence: 0,
      strengths: ["Interview was not completed."],
      improvements: ["Complete an interview to receive feedback."],
      recommendedTopics: [],
    };
  }

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", reportSystemTemplate],
    ["human", `Interview session data:\n\n${sessionData}\n\nGenerate the final report.`],
  ]);

  const chain = prompt.pipe(llm).pipe(new JsonOutputParser());
  const result = await chain.invoke({ sessionData });

  return {
    overallScore: Math.min(100, Math.max(0, result.overallScore || 0)),
    technicalAccuracy: Math.min(100, Math.max(0, result.technicalAccuracy || 0)),
    communication: Math.min(100, Math.max(0, result.communication || 0)),
    problemSolving: Math.min(100, Math.max(0, result.problemSolving || 0)),
    confidence: Math.min(100, Math.max(0, result.confidence || 0)),
    strengths: (result.strengths || []).slice(0, 5),
    improvements: (result.improvements || []).slice(0, 5),
    recommendedTopics: (result.recommendedTopics || []).slice(0, 5),
  };
}

async function startSession({ userId, interviewType, duration }) {
  const totalQuestions = getQuestionCount(duration);
  const resumeContext = await getResumeContext(userId, interviewType);

  const opening = await generateOpeningQuestion({ userId, interviewType, resumeContext });

  const session = await InterviewSession.create({
    userId,
    interviewType,
    duration,
    totalQuestions,
    questions: [
      {
        questionNumber: 1,
        question: opening.message,
        questionType: opening.type,
        topic: opening.topic,
      },
    ],
    conversation: [
      { role: "interviewer", message: opening.message },
    ],
  });

  return {
    sessionId: session._id,
    questionNumber: 1,
    totalQuestions,
    message: opening.message,
    questionType: opening.type,
    topic: opening.topic,
  };
}

async function answerQuestion({ sessionId, userId, answer }) {
  const session = await InterviewSession.findOne({ _id: sessionId, userId });
  if (!session) {
    const err = new Error("Interview session not found");
    err.statusCode = 404;
    throw err;
  }
  if (session.status === "completed") {
    const err = new Error("Interview already completed");
    err.statusCode = 400;
    throw err;
  }

  // Store candidate answer in conversation
  session.conversation.push({ role: "candidate", message: answer });

  const currentQ = session.questions[session.questions.length - 1];
  const evaluation = await evaluateAnswer({
    questionData: {
      question: currentQ.question,
      type: currentQ.questionType,
      topic: currentQ.topic,
    },
    answer,
  });

  currentQ.answer = answer;
  currentQ.score = evaluation.score;
  currentQ.strengths = evaluation.strengths;
  currentQ.improvements = evaluation.improvements;

  const isComplete = session.currentQuestionNumber >= session.totalQuestions;

  let nextMessage = null;
  if (!isComplete) {
    const resumeContext = await getResumeContext(userId, session.interviewType);

    const followUp = await generateFollowUp({
      interviewType: session.interviewType,
      conversation: session.conversation,
      resumeContext,
    });

    session.conversation.push({ role: "interviewer", message: followUp.message });

    const isNewTopic = !followUp.isFollowUp;
    if (isNewTopic) {
      session.questions.push({
        questionNumber: session.currentQuestionNumber + 1,
        question: followUp.message,
        questionType: followUp.type,
        topic: followUp.topic,
      });
      session.currentQuestionNumber += 1;
    }

    nextMessage = {
      message: followUp.message,
      questionType: followUp.type,
      topic: followUp.topic,
      isFollowUp: followUp.isFollowUp,
    };
  }

  await session.save();

  return {
    isComplete,
    nextMessage,
  };
}

async function endSession({ sessionId, userId }) {
  const session = await InterviewSession.findOne({ _id: sessionId, userId });
  if (!session) {
    const err = new Error("Interview session not found");
    err.statusCode = 404;
    throw err;
  }

  const answeredQuestions = session.questions.filter((q) => q.answer);
  const report = answeredQuestions.length > 0
    ? await generateFinalReport(session.questions)
    : {
        overallScore: 0, technicalAccuracy: 0, communication: 0,
        problemSolving: 0, confidence: 0,
        strengths: ["No answers were provided."],
        improvements: ["Answer at least one question to receive feedback."],
        recommendedTopics: [],
      };

  session.finalReport = report;
  session.status = "completed";
  await session.save();

  return {
    sessionId: session._id,
    finalReport: report,
    questions: session.questions,
    conversation: session.conversation,
  };
}

async function getSession({ sessionId, userId }) {
  const session = await InterviewSession.findOne({ _id: sessionId, userId }).lean();
  if (!session) {
    const err = new Error("Interview session not found");
    err.statusCode = 404;
    throw err;
  }
  return {
    sessionId: session._id,
    interviewType: session.interviewType,
    duration: session.duration,
    status: session.status,
    questions: session.questions,
    conversation: session.conversation,
    finalReport: session.finalReport,
    createdAt: session.createdAt,
  };
}

async function getHistory(userId) {
  const sessions = await InterviewSession.find({ userId })
    .sort({ createdAt: -1 })
    .select("interviewType duration status finalReport.overallScore createdAt")
    .lean();
  return sessions.map((s) => ({
    sessionId: s._id,
    interviewType: s.interviewType,
    duration: s.duration,
    status: s.status,
    overallScore: s.finalReport?.overallScore ?? null,
    createdAt: s.createdAt,
  }));
}

module.exports = {
  startSession,
  answerQuestion,
  endSession,
  uploadMockResume,
  getLatestMockResume,
  getSession,
  getHistory,
};
