const { Router } = require("express");
const { z } = require("zod");
const multer = require("multer");
const validate = require("../middleware/validate.middleware");
const authenticate = require("../middleware/auth.middleware");
const { uploadPDF } = require("../middleware/upload.middleware");
const aiController = require("../controllers/ai.controller");
const ApiError = require("../utils/ApiError");

const router = Router();

router.use(authenticate);

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
