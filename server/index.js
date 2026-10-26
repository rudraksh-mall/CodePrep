const app = require("./src/app");
const { port, mongodbUri } = require("./src/config/env");
const connectDB = require("./src/config/db");

async function start() {
  try {
    await connectDB(mongodbUri);
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
