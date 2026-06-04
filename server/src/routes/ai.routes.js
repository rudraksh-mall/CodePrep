const { Router } = require("express");
const { z } = require("zod");
const validate = require("../middleware/validate.middleware");
const authenticate = require("../middleware/auth.middleware");
const aiController = require("../controllers/ai.controller");

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

module.exports = router;
