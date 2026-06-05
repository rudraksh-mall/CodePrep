const { ChromaClient } = require("chromadb");

const client = new ChromaClient();

async function getOrCreateCollection(name) {
  return client.getOrCreateCollection({ name });
}

module.exports = { client, getOrCreateCollection };
