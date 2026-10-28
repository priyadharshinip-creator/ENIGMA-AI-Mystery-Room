# 🕵️ ENIGMA – AI-Powered Mystery Investigation Room

An AI-powered full-stack detective mystery web application that allows users to create and solve interactive criminal investigations.

## 🌐 Live Demo

https://enigma-ai-mystery-room.vercel.app

## ✨ Features

- AI-generated mysteries based on user-provided premises
- Easy, Medium, and Hard difficulty levels
- Interactive suspect investigation
- Clue discovery and evidence exploration
- Detective hints
- Suspect accusation and case resolution
- Performance-based scoring

## 🛠️ Tech Stack

**Frontend:** React.js, Vite, Tailwind CSS

**Backend:** Node.js, Express.js

**Database:** MongoDB Atlas

**AI:** Google Gemini API

**Deployment:** Vercel (Frontend), Render (Backend)

## ⚙️ Local Setup

### Prerequisites

- Node.js and npm
- MongoDB Atlas connection string
- Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/priyadharshinip-creator/ENIGMA-AI-Mystery-Room.git
cd ENIGMA-AI-Mystery-Room
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `server/.env` file with:

```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
CLIENT_URL=http://localhost:5173
```

Start the backend using the start command defined in `server/package.json`.

### 3. Frontend setup

Open another terminal in the project root:

```bash
cd client
npm install
```

Create a `client/.env` file with:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## 🔗 Deployment

- Frontend: https://enigma-ai-mystery-room.vercel.app
- Backend: https://enigma-ai-mystery-room.onrender.com

## 🔒 Security

API keys and database credentials are stored in environment variables and should never be committed to GitHub.

## 👩‍💻 Developer

Developed by Priyadharshini P.
