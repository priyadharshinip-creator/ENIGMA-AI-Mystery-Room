# ENIGMA — AI Mystery Room

## 1. Project Overview
ENIGMA is an AI-powered detective game where players create mysteries using Gemini, investigate suspects, discover clues, request hints, and identify the culprit.

## 2. Problem Statement
Traditional mystery games have fixed stories. ENIGMA generates new interactive mysteries to improve observation, reasoning, and problem-solving.

## 3. Target Users
Students, puzzle lovers, detective fans, and casual gamers.

## 4. Technology Stack
- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express
- Database: MongoDB Atlas, Mongoose
- AI: Google Gemini API (@google/genai)
- Validation: Zod
- Deployment: Vercel, Render

## 5. Core Features
- Enter a mystery premise
- Select Easy, Medium, or Hard
- Generate mysteries with Gemini
- Investigate suspects and discover clues
- Request hints
- Submit an accusation
- View verdict, culprit, explanation, and score
- Play again

## 6. User Flow
Home → Create Mystery → Investigation → Accusation → Results → Play Again

## 7. UI Pages
Home: Introduction and Start Investigation button.
Create Mystery: Premise, difficulty, generate button, loading and errors.
Investigation: Story, suspects, clues, hints, progress.
Accusation: Select suspect and confirm.
Results: Verdict, score, culprit, explanation, Play Again.

All pages must be responsive and handle loading, errors, and navigation.

## 8. Difficulty Rules
| Level | Suspects | Clues | Hints | Base Points |
|---|---:|---:|---:|---:|
| Easy | 3 | 5 | 2 | 100 |
| Medium | 4 | 7 | 3 | 150 |
| Hard | 5 | 9 | 3 | 200 |

## 9. Scoring
Correct accusation earns base points; incorrect earns zero base points.
Each discovered clue: +5.
Each hint used: -10.
Final score = max(0, base + 5 × clues discovered - 10 × hints used).
All scoring occurs on the backend.

## 10. Gemini Output
Generate structured JSON containing title, story, difficulty, suspects, clues, hints, culpritId, and explanation.
Each suspect needs id, name, role, description, motive, and alibi.
Each clue needs id, title, description, and location.
Each hint needs id and text.
Validate JSON with Zod, ensure unique IDs, exact counts, and a logically supported solution. Retry or return an error for invalid output.

## 11. API Endpoints
POST /api/cases — Generate case from { premise, difficulty }.
GET /api/cases/:id — Return public case and progress.
POST /api/cases/:id/clues/:clueId/discover — Discover clue.
POST /api/cases/:id/hints — Request next hint.
POST /api/cases/:id/accuse — Submit { suspectId }.
GET /api/cases/:id/result — Return result after accusation.

Responses must have consistent JSON formats and meaningful HTTP errors.

## 12. MongoDB Model
Case:
title, premise, story, difficulty,
suspects[], clues[], hints[],
culpritId, explanation,
discoveredClueIds[], usedHintIds[],
accusation, score, status,
createdAt, updatedAt.

## 13. Security
- Keep Gemini key and MongoDB URI in server .env.
- Never expose culpritId or explanation before accusation.
- Construct public API responses without private fields.
- Validate all input and AI-generated output.
- Prevent duplicate clue awards and accusations.
- Use unguessable case access tokens verified on every case request.
- Configure CORS and rate limiting.
- Calculate all scores on the server.

## 14. Error Handling
Handle invalid inputs, unavailable AI, invalid AI output, missing cases, unauthorized access, and network errors. Disable duplicate submissions while loading.

## 15. Acceptance Criteria
- All three difficulties work with exact counts.
- Clues and hints update progress correctly.
- Culprit remains private until accusation.
- Scores are accurate and server-validated.
- Results reveal culprit and explanation.
- All five pages work on mobile and desktop.
- Full gameplay works after deployment.

## 16. Limitations
Internet, Gemini API access, and database connectivity are required. The first version supports one player per case without accounts.

## 17. Deliverables
SPEC.md, complete source code, tested application, GitHub repository, and deployed website URL.
