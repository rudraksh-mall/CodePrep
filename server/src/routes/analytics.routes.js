const { Router } = require("express");
const authenticate = require("../middleware/auth.middleware");
const analyticsController = require("../controllers/analytics.controller");

const router = Router();

router.use(authenticate);

router.get("/summary", analyticsController.getSummary);
router.get("/by-topic", analyticsController.getByTopic);
router.get("/by-difficulty", analyticsController.getByDifficulty);
router.get("/over-time", analyticsController.getOverTime);

module.exports = router;
