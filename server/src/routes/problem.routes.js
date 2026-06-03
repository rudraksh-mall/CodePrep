const { Router } = require("express");
const authenticate = require("../middleware/auth.middleware");
const problemController = require("../controllers/problem.controller");

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/problems - Get all problems with filtering and pagination
 * Query params:
 * - page: page number (default 1)
 * - limit: items per page (default 10, max 100)
 * - difficulty: Easy, Medium, Hard
 * - topics: comma-separated or array of topics
 * - companies: comma-separated or array of companies
 * - search: full-text search query
 */
router.get("/", problemController.getAllProblems);

/**
 * GET /api/problems/filters/topics - Get all distinct topics
 */
router.get("/filters/topics", problemController.getTopics);

/**
 * GET /api/problems/filters/companies - Get all distinct companies
 */
router.get("/filters/companies", problemController.getCompanies);

/**
 * GET /api/problems/:slug - Get a single problem by slug
 */
router.get("/:slug", problemController.getProblemBySlug);

module.exports = router;
