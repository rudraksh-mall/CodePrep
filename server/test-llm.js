require("dotenv").config();

const { getLLM } = require("./src/services/ai/embeddings.service");

async function main() {
  try {
    const llm = getLLM();

    const response = await llm.invoke("Reply with exactly: CodePrep works");

    console.log(response.content);
  } catch (error) {
    console.error(error);
  }
}

main();
