const dotenv = require('dotenv');

dotenv.config();

const requiredVars = ['PORT', 'MONGODB_URI', 'JWT_SECRET', 'GEMINI_API_KEY'];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

module.exports = {
  port: parseInt(process.env.PORT, 10),
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  geminiApiKey: process.env.GEMINI_API_KEY,
};
