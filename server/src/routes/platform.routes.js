const { Router } = require("express");
const { z } = require("zod");
const validate = require("../middleware/validate.middleware");
const authenticate = require("../middleware/auth.middleware");
const platformController = require("../controllers/platform.controller");

const router = Router();

router.use(authenticate);

const linkSchema = z.object({
  platform: z.enum(["leetcode", "codeforces"]),
  username: z.string().min(1, "Username is required").max(100),
});

router.post("/", validate(linkSchema), platformController.linkPlatform);
router.get("/", platformController.getLinkedPlatforms);
router.delete("/:platform", platformController.unlinkPlatform);
router.post("/sync", platformController.syncPlatform);

module.exports = router;
