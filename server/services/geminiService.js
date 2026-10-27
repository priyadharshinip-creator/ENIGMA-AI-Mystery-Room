
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { timeout: 45000 }
});

const mysterySchema = z.object({
  title: z.string().min(3),
  story: z.string().min(50),

  suspects: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    alibi: z.string()
  })),

  clues: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string()
  })),

  hints: z.array(z.string()),

  culpritId: z.string(),
  explanation: z.string().min(30)
});

const requirements = {
  easy: { suspects: 3, clues: 5, hints: 2 },
  medium: { suspects: 4, clues: 7, hints: 3 },
  hard: { suspects: 5, clues: 9, hints: 3 }
};

async function generateMystery(premise, difficulty) {
  const config = requirements[difficulty];

  if (!config) {
    throw new Error("Invalid difficulty");
  }

  const prompt = `
Create a fictional detective mystery based on:
${JSON.stringify(premise)}

Difficulty: ${difficulty}

Requirements:
- Exactly ${config.suspects} suspects.
- Exactly ${config.clues} clues.
- Exactly ${config.hints} hints.
- Every suspect has a unique id, name, description and alibi.
- Every clue has a unique id, title and description.
- culpritId must match exactly one suspect id.
- The culprit must be logically identifiable from the clues.
- The explanation must clearly reference supporting evidence.
- No supernatural or impossible solution.
- Keep the culprit secret in the story, clues and hints.
- Return a JSON object only.

JSON fields:
title, story, suspects, clues, hints,
culpritId, explanation
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  const parsed = mysterySchema.parse(
    JSON.parse(response.text)
  );

  if (
    parsed.suspects.length !== config.suspects ||
    parsed.clues.length !== config.clues ||
    parsed.hints.length !== config.hints
  ) {
    throw new Error("AI returned incorrect mystery counts");
  }

  const suspectIds = parsed.suspects.map(s => s.id);
  const clueIds = parsed.clues.map(c => c.id);

  if (
    new Set(suspectIds).size !== suspectIds.length ||
    new Set(clueIds).size !== clueIds.length ||
    !suspectIds.includes(parsed.culpritId)
  ) {
    throw new Error("AI returned inconsistent IDs");
  }

  return parsed;
}

module.exports = { generateMystery };
