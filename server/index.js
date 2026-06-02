const app = require('./src/app');
const { port, mongodbUri } = require('./src/config/env');
const connectDB = require('./src/config/db');

async function start() {
  connectDB(mongodbUri).catch((err) => {
    console.error('MongoDB connection failed:', err.message);
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
