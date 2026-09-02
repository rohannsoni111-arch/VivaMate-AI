# VivaMate — AI Avatar Technical Viva Examiner

VivaMate is a production-quality AI-powered technical viva voce examiner designed for engineering and college students. It uses a dynamic AI avatar and speech-to-text voice interaction to conduct realistic oral technical examinations across core Computer Science subjects.

## Features
- **Voice-First Viva Experience**: Interactive speech-to-text voice answer submission with real-time audio visualizers and Text-to-Speech question playback.
- **Dynamic AI Examiner Engine**: Evaluates technical accuracy, conceptual clarity, and communication depth, automatically generating adaptive follow-up questions.
- **Interactive AI Avatar**: Visual examiner avatar rendering dynamic states (`speaking`, `listening`, `thinking`, `idle`) with animated facial expressions and halo indicators.
- **Comprehensive Evaluation Report**: Detailed post-viva breakdown including overall score, technical accuracy, conceptual understanding, answer clarity, key strengths, weaknesses, topics to revise, and recommended practice.
- **Session Recovery & Analytics**: Automatic session state recovery upon browser refresh and real-world usage event tracking.

## Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Web Speech API.
- **Backend**: Python FastAPI, Pydantic V2, Uvicorn, Pytest.
- **AI/LLM**: Modular LLM Engine (Gemini API with fallback evaluator).

## Local Setup

### Prerequisites
- Node.js >= 18.x and npm
- Python >= 3.10

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

## Environment Variables

### Backend (`backend/.env` optional)
```env
LLM_API_KEY=your_gemini_or_openai_api_key
USE_MOCK_AI=false
```

### Frontend (`frontend/.env.local` optional)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Start Commands

### Backend Start Command
```bash
cd backend
.\venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
```
Backend will run at: `http://localhost:8000` (Health check at `http://localhost:8000/health`).

### Frontend Start Command
```bash
cd frontend
npm run dev
```
Frontend will run at: `http://localhost:3000`.

## Testing Commands

### Backend Automated Tests
```bash
cd backend
.\venv\Scripts\python -m pytest
```

### Frontend Production Build Test
```bash
cd frontend
npm run build
```

## Deployment Notes
- **Frontend**: Deploy to Vercel / Netlify / Firebase App Hosting using `npm run build` with root directory set to `frontend`.
- **Backend**: Deploy to Render / Cloud Run / Railway running `uvicorn app.main:app --host 0.0.0.0 --port 8000`.
- **CORS**: Ensure `ALLOW_ORIGINS` in `backend/app/core/config.py` includes your deployed frontend domain.
