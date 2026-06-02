const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const ApiError = require('./utils/ApiError');
const ApiResponse = require('./utils/ApiResponse');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '16kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

app.get('/', (_req, res) => {
  res.status(200).json(new ApiResponse(200, null, 'CodePrep AI API'));
});

app.use('/api/auth', authRoutes);

app.use((_req, _res, next) => {
  next(new ApiError(404, 'Route not found'));
});

app.use(errorHandler);

module.exports = app;
