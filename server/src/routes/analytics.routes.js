const { Router } = require("express");
const authenticate = require("../middleware/auth.middleware");
const analyticsController = require("../controllers/analytics.controller");

const router = Router();

router.use(authenticate);

router.get("/summary", analyticsController.getSummary);
router.get("/by-topic", analyticsController.getByTopic);
router.get("/by-difficulty", analyticsController.getByDifficulty);
router.get("/over-time", analyticsController.getOverTime);
router.get("/consistency", analyticsController.getConsistency);
router.get("/monthly-trends", analyticsController.getMonthlyTrends);
router.get("/topic-growth", analyticsController.getTopicGrowth);
router.get("/time-investment", analyticsController.getTimeInvestment);
router.get("/readiness-breakdown", analyticsController.getReadinessBreakdown);
router.get("/topic-mastery", analyticsController.getTopicMastery);

module.exports = router;
