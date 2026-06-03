const problemService = require("../services/problem.service");
const ApiResponse = require("../utils/ApiResponse");

/**
 * Get all problems with filtering and pagination
 * Query params:
 * - page: page number (default 1)
 * - limit: items per page (default 10, max 100)
 * - difficulty: Easy, Medium, Hard
 * - topics: comma-separated or array of topics
 * - companies: comma-separated or array of companies
 * - search: full-text search query
 */
async function getAllProblems(req, res) {
  const {
    page = 1,
    limit = 10,
    difficulty,
    topics,
    companies,
    search,
  } = req.query;

  // Validate and parse limit
  const parsedLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
  const parsedPage = Math.max(parseInt(page) || 1, 1);

  // Parse topics and companies from query params
  let topicsArray = [];
  let companiesArray = [];

  if (topics) {
    topicsArray = Array.isArray(topics)
      ? topics
      : topics.split(",").map((t) => t.trim());
  }

  if (companies) {
    companiesArray = Array.isArray(companies)
      ? companies
      : companies.split(",").map((c) => c.trim());
  }

  const result = await problemService.getProblems({
    page: parsedPage,
    limit: parsedLimit,
    difficulty,
    topics: topicsArray,
    companies: companiesArray,
    search,
  });

  res.status(200).json(
    new ApiResponse(200, result, "Problems retrieved successfully"),
  );
}

/**
 * Get a single problem by slug
 */
async function getProblemBySlug(req, res) {
  const { slug } = req.params;

  const problem = await problemService.getProblemBySlug(slug);

  res
    .status(200)
    .json(new ApiResponse(200, problem, "Problem retrieved successfully"));
}

/**
 * Get all distinct topics
 */
async function getTopics(req, res) {
  const topics = await problemService.getTopics();

  res.status(200).json(new ApiResponse(200, topics, "Topics retrieved"));
}

/**
 * Get all distinct companies
 */
async function getCompanies(req, res) {
  const companies = await problemService.getCompanies();

  res
    .status(200)
    .json(
      new ApiResponse(200, companies, "Companies retrieved successfully"),
    );
}

module.exports = {
  getAllProblems,
  getProblemBySlug,
  getTopics,
  getCompanies,
};
