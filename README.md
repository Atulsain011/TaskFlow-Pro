# AI Study Assistant 🧠

Welcome to the AI Study Assistant! A full-stack web application designed to help you upload notes (Text or PDF) and utilize AI to summarize concepts, explain complex ideas like you are 5, or generate quick quizzes.

## Core Setup Instructions

### 1. Backend Server Setup
1. Open terminal in the `backend` folder.
2. Install dependencies: `npm install`
3. Edit the `.env` file and replace `OPENAI_API_KEY` placeholder with your active OpenAI Developer key.
4. Setup your MongoDB connection string inside `.env` via the `MONGO_URI`.
5. Run the server using commands from `backend/package.json` such as `npm run dev` or simply `npx nodemon server.js`. Server starts on `http://localhost:5000`.

### 2. Frontend Web Setup
1. Open another terminal and traverse to the `frontend` folder.
2. Run `npm install` to download Vite dependencies.
3. Once completed, deploy the development React app by running `npm run dev`.
4. Open your browser on `http://localhost:5173`.

Enjoy enhanced study experiences with built-in dark modes, responsive voice synthesis, and multi-language UI!
