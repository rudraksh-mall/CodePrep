// server/test-assistant.js

require("dotenv").config();

const { getAssistantResponse } = require("./src/services/ai/assistant.service");

(async () => {
  const response = await getAssistantResponse({
    message: "What is dynamic programming?",
    chatHistory: [],
  });

  console.log(response);
})();
