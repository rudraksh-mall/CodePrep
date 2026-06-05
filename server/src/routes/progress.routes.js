const { Router } = require("express");
const { z } = require("zod");
const validate = require("../middleware/validate.middleware");
const authenticate = require("../middleware/auth.middleware");
const progressController = require("../controllers/progress.controller");

const router = Router();

router.use(authenticate);

const upsertSchema = z.object({
  problemId: z.string(),
  status: z.enum(["attempted", "solved", "unsolved"]),
  timeSpentMinutes: z.number().min(0).optional(),
});

router.put("/", validate(upsertSchema), progressController.upsertProgress);
router.get("/", progressController.getUserProgress);
router.get("/:problemId", progressController.getProgressForProblem);

module.exports = router;
