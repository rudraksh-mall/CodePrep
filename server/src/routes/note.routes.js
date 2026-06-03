const { Router } = require("express");
const { z } = require("zod");
const validate = require("../middleware/validate.middleware");
const authenticate = require("../middleware/auth.middleware");
const noteController = require("../controllers/note.controller");

const router = Router();

router.use(authenticate);

const upsertSchema = z.object({
  problemId: z.string(),
  content: z.string(),
});

router.put("/", validate(upsertSchema), noteController.upsertNote);
router.get("/:problemId", noteController.getNote);

module.exports = router;
