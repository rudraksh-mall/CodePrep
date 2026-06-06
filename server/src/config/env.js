const dotenv = require('dotenv');

dotenv.config();

const requiredVars = ['PORT', 'MONGODB_URI', 'JWT_SECRET'];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

module.exports = {
  port: parseInt(process.env.PORT, 10),
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  openrouterApiKey: process.env.OPENROUTER_API_KEY,
  pineconeApiKey: process.env.PINECONE_API_KEY,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
