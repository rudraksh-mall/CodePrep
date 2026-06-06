const Problem = require("../models/Problem");
const ApiError = require("../utils/ApiError");

/**
 * Get all problems with filtering and pagination
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.limit - Items per page
 * @param {string} options.difficulty - Filter by difficulty (Easy, Medium, Hard)
 * @param {string[]} options.topics - Filter by topics
 * @param {string[]} options.companies - Filter by companies
 * @param {string} options.search - Full-text search query
 * @returns {Object} { problems, total, pages }
 */
async function getProblems({
  page = 1,
  limit = 10,
  difficulty,
  topics,
  companies,
  search,
}) {
  // Build query dynamically
  const query = {};

  // Filter by difficulty if provided
  if (difficulty) {
    if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
      throw new ApiError(400, "Invalid difficulty level");
    }
    query.difficulty = difficulty;
  }

  // Filter by topics if provided
  if (topics && topics.length > 0) {
    query.topics = { $in: topics };
  }

  // Filter by companies if provided
  if (companies && companies.length > 0) {
    query.companies = { $in: companies };
  }

  // Full-text search if provided
  if (search && search.trim()) {
    query.$text = { $search: search.trim() };
  }

  try {
    // Get total count for pagination
    const total = await Problem.countDocuments(query);
    const pages = Math.ceil(total / limit);

    // Validate page number
    const pageNum = Math.max(1, Math.min(page, pages || 1));
    const skip = (pageNum - 1) * limit;

    // Fetch problems with sorting
    const problems = await Problem.find(query)
      .select("-examples -constraints") // Exclude heavy fields for list view
      .sort({ difficulty: 1, title: 1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      problems,
      total,
      pages,
      currentPage: pageNum,
      hasMore: pageNum < pages,
    };
  } catch (error) {
    // Handle text search specific errors
    if (error.message && error.message.includes("text")) {
      throw new ApiError(400, "Invalid search query");
    }
    throw error;
  }
}

/**
 * Get a single problem by slug
 * @param {string} slug - Problem slug
 * @returns {Object} Problem document
 */
async function getProblemBySlug(slug) {
  const problem = await Problem.findOne({ slug }).exec();

  if (!problem) {
    throw new ApiError(404, `Problem not found: ${slug}`);
  }

  return problem;
}

/**
 * Get all distinct topics
 * @returns {Array} Array of topic strings
 */
async function getTopics() {
  const topics = await Problem.distinct("topics");
  return topics.sort();
}

/**
 * Get all distinct companies
 * @returns {Array} Array of company strings
 */
async function getCompanies() {
  const companies = await Problem.distinct("companies");
  return companies.filter((c) => c && c.trim()).sort();
}

module.exports = {
  getProblems,
  getProblemBySlug,
  getTopics,
  getCompanies,
};
