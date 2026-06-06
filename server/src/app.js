const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const ApiError = require('./utils/ApiError');
const ApiResponse = require('./utils/ApiResponse');
const { nodeEnv, frontendUrl } = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const problemRoutes = require('./routes/problem.routes');
const progressRoutes = require('./routes/progress.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const noteRoutes = require('./routes/note.routes');
const aiRoutes = require('./routes/ai.routes');
const platformRoutes = require('./routes/platform.routes');
const interviewRoutes = require('./routes/interview.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const corsOrigins = {};

if (nodeEnv === 'production') {
  corsOrigins[frontendUrl] = true;
} else {
  corsOrigins['http://localhost:5173'] = true;
  corsOrigins['http://localhost:5000'] = true;
}

app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));

app.use(helmet({ contentSecurityPolicy: false }));

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

app.use(morgan(nodeEnv === 'production' ? 'combined' : 'dev'));

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
app.use('/api/problems', problemRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/platforms', platformRoutes);
app.use('/api/interview', interviewRoutes);

app.use((_req, _res, next) => {
  next(new ApiError(404, 'Route not found'));
});

app.use(errorHandler);

module.exports = app;
