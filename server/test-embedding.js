// test-embeddings.js

require("dotenv").config();

const { getEmbeddings } = require("./src/services/ai/embeddings.service");

async function main() {
  try {
    const embeddings = getEmbeddings();

    const vector = await embeddings.embedQuery("Two Sum");

    console.log("Vector length:", vector.length);
  } catch (error) {
    console.error(error);
  }
}

main();
