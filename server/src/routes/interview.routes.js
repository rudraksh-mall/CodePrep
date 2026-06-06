const { Router } = require("express");
const { z } = require("zod");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const validate = require("../middleware/validate.middleware");
const authenticate = require("../middleware/auth.middleware");
const { uploadPDF } = require("../middleware/upload.middleware");
const interviewController = require("../controllers/interview.controller");
const ApiError = require("../utils/ApiError");

const router = Router();

router.use(authenticate);

const interviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  keyGenerator: (req) => req.user._id.toString(),
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(interviewLimiter);

const startSchema = z.object({
  type: z.enum(["DSA", "Resume-Based", "Behavioral", "Mixed"]),
  duration: z.number().int().refine((val) => [15, 30, 45].includes(val), {
    message: "duration must be 15, 30, or 45",
  }),
});

const answerSchema = z.object({
  sessionId: z.string(),
  answer: z.string().min(1, "Answer is required").max(5000, "Answer is too long"),
});

const endSchema = z.object({
  sessionId: z.string(),
});

router.post("/start", validate(startSchema), interviewController.startInterview);
router.post("/answer", validate(answerSchema), interviewController.answerQuestion);
router.post("/end", validate(endSchema), interviewController.endInterview);

router.get("/history", interviewController.getHistory);
router.get("/session/:sessionId", interviewController.getSession);
router.get("/mock-resume/latest", interviewController.getLatestMockResume);
router.post("/mock-resume/upload", (req, res, next) => {
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
}, interviewController.uploadMockResume);

module.exports = router;
