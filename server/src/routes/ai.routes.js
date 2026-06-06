const { Router } = require("express");
const { z } = require("zod");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const validate = require("../middleware/validate.middleware");
const authenticate = require("../middleware/auth.middleware");
const { uploadPDF } = require("../middleware/upload.middleware");
const aiController = require("../controllers/ai.controller");
const ApiError = require("../utils/ApiError");

const router = Router();

router.use(authenticate);

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  keyGenerator: (req) => req.user._id.toString(),
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(aiLimiter);

const hintSchema = z.object({
  problemTitle: z.string().min(1, "problemTitle is required"),
  problemDescription: z.string().min(1, "problemDescription is required"),
  hintLevel: z
    .number()
    .int()
    .refine((val) => [1, 2, 3].includes(val), {
      message: "hintLevel must be 1, 2, or 3",
    }),
});

router.post("/hint", validate(hintSchema), aiController.generateHint);

const questionsSchema = z.object({
  targetRole: z.string().min(1, "targetRole is required"),
  questionCount: z.number().int().min(5).max(30).optional(),
});

router.post("/resume/:resumeId/questions", validate(questionsSchema), aiController.generateInterviewQuestions);

const chatSchema = z.object({
  message: z.string().min(1, "Message is required").max(2000, "Message must be under 2000 characters"),
  chatHistory: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .max(20, "Chat history cannot exceed 20 messages")
    .optional(),
});

router.post("/chat", validate(chatSchema), aiController.chat);

const roadmapSchema = z.object({
  weakTopics: z.array(z.string()).optional(),
  strongTopics: z.array(z.string()).optional(),
  mode: z.enum(["manual", "analytics", "hybrid"]).optional(),
  targetRole: z.string().min(1, "targetRole is required"),
  duration: z.number().int().refine((val) => [30, 60, 90].includes(val), {
    message: "duration must be 30, 60, or 90",
  }),
  currentLevel: z.enum(["beginner", "intermediate", "advanced"]),
});

router.post("/roadmap", validate(roadmapSchema), aiController.generateRoadmap);
router.get("/roadmap", aiController.getRoadmap);

router.get("/resume/latest", aiController.getLatestResumeAnalysis);

router.post("/resume/upload", (req, res, next) => {
  uploadPDF(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(new ApiError(400, "File too large — max 5MB"));
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return next(new ApiError(400, "Unexpected file field"));
        }
      }
      return next(err);
    }
    if (!req.file) {
      return next(new ApiError(400, "No file uploaded"));
    }
    next();
  });
}, aiController.uploadResume);

module.exports = router;
