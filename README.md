# AI Study Assistant 
### Transforming the way you learn with Artificial Intelligence.

The **AI Study Assistant** is a cutting-edge, full-stack ecosystem designed to empower students and researchers. By leveraging advanced Large Language Models (LLMs), it converts static notes and dense PDFs into interactive learning experiences.

---

##  Key Features

*   ** Intelligent Summarization**: Instantly distill long chapters or complex documents into concise, high-impact bullet points.
*   ** Explain Like I'm Five (ELI5)**: Break down intimidating concepts into simple, relatable language with a single click.
*   ** Dynamic Quiz Generation**: Automatically generate interactive quizzes from your study material to test your retention.
*   ** Voice Synthesis (TTS)**: Listen to AI-generated explanations on the go with integrated audio playback.
*   ** PDF & Text Seamless Entry**: Drag-and-drop your PDF files or paste raw text directly into the processing engine.
*   ** Premium UI/UX**: Switch between a sleek Dark Mode and a crisp Light Mode. Fully responsive design for mobile and tablet.
*   ** Bilingual Support**: Native support for **English** and **Hindi (अध्ययन सहायक)**.

---

##  Tech Stack & Infrastructure

This application is built with a rock-solid **MERN Stack** (MongoDB, Express, React, Node.js) for high performance and scalability:

- **Frontend**: React-powered UI using **Vite** for blazing fast loads.
- **Backend**: Node.js & Express server with secure JWT authentication.
- **Artificial Intelligence**: Integrated with **OpenAI's latest models** for highly accurate text processing.
- **Storage**: MongoDB Atlas for persistent history and user preferences.
- **Animations**: Fluid transitions driven by **Framer Motion**.

---

## 🏁 Quick Setup Guide

If you are a developer looking to deploy this locally, follow these steps:

### 1. Server Configuration
```bash
cd backend
npm install
# Configure your .env with:
# MONGO_URI, JWT_SECRET, and OPENAI_API_KEY
npm run dev
