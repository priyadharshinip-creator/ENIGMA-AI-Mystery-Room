
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    timeout: 30000
  }
});

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function testGemini() {
  const models = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite"
];

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(
          `Testing ${model} - Attempt ${attempt}`
        );

        const response = await ai.models.generateContent({
          model,
          contents: "Write a detective mystery in 2 sentences."
        });

        console.log("\nGEMINI RESPONSE:\n");
        console.log(response.text);
        console.log("\nGemini API connected successfully!");
        console.log("Working model:", model);
        return;

      } catch (error) {
        const status = error.status || error.code ||
          Number(error.message?.match(/"code":(\d+)/)?.[1]);

        console.log(`Request failed: ${status || error.message}`);

        if (status !== 503 && status !== 429) {
          console.log("Check model access, API key or configuration.");
          return;
        }

        if (attempt < 3) {
          const delay = 2000 * (2 ** (attempt - 1));
          console.log(`Waiting ${delay / 1000} seconds...`);
          await sleep(delay);
        }
      }
    }
  }

  console.log("Gemini is still unavailable. Try again later.");
}

testGemini();
