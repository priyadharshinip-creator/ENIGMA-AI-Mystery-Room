
require("dotenv").config();

async function listModels() {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models",
      {
        headers: {
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        signal: AbortSignal.timeout(15000)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("API Error:", data.error?.message);
      return;
    }

    console.log("\nAvailable models:\n");

    for (const model of data.models || []) {
      if (
        model.supportedGenerationMethods?.includes(
          "generateContent"
        )
      ) {
        console.log(model.name);
      }
    }

  } catch (error) {
    console.log("Error:", error.message);
  }
}

listModels();
