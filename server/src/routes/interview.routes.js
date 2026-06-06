const { Router } = require("express");
const { z } = require("zod");
const rateLimit = require("express-rate-limit");
const validate = require("../middleware/validate.middleware");
const authenticate = require("../middleware/auth.middleware");
const interviewController = require("../controllers/interview.controller");

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
  duration: z.number().int().refine((val) => [5, 10, 20].includes(val), {
    message: "duration must be 5, 10, or 20",
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

module.exports = router;
