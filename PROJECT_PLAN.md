# PROJECT PLAN — VivaMate (AI Avatar Technical Viva Examiner)

## Product Objective
Provide engineering/college students with a realistic, interactive, low-pressure AI-powered voice & avatar viva examination experience to practice speaking answers, receive dynamic follow-up questions, and get actionable performance evaluations.

## Target User
Engineering and college students preparing for technical viva voce exams in subjects like Machine Learning, DBMS, Operating Systems, and Computer Networks.

## Core User Flow
1. **Landing & Setup**: Student selects subject (ML, DBMS, OS, Computer Networks) and difficulty level (Easy, Medium, Hard).
2. **Viva Room Entry**: Student starts session. AI Avatar introduces itself and speaks the first question via TTS.
3. **Voice Response**: Student listens and answers using microphone (Speech-to-Text).
4. **Adaptive Evaluation & Follow-up**: AI evaluates response accuracy/depth and generates dynamic follow-up question.
5. **Session Progress**: Repeat for 5–10 questions; real-time status & question tracking.
6. **Final Evaluation**: Overall score, breakdown by Technical Accuracy, Conceptual Understanding, Answer Clarity, Confidence/Communication, and targeted recommendations/topics to revise.

## MVP Features
- Subject & Difficulty Selection
- Interactive Viva Room UI with avatar presentation area, transcript box, microphone controls, and progress indicators
- FastAPI backend session management, state tracking, and answer history
- Modular AI Examiner engine (adaptive question selection, follow-up generation, answer scoring)
- Voice interaction (Browser Speech Recognition/STT + TTS synthesis fallback)
- Modular Avatar integration (Web-based dynamic audio-visual examiner with fallbacks)
- Final Report card with comprehensive score analytics and recommendations
- Basic product usage event tracking

## Architecture
```
+-------------------------------------------------------------+
|                      Frontend (Next.js)                     |
|  [ Landing / Setup ] ---> [ Viva Room ] ---> [ Results ]    |
|   - Avatar View Component (Canvas/Audio Sync)               |
|   - Web Speech STT & TTS Integration                        |
+------------------------------+------------------------------+
                               | REST APIs
+------------------------------v------------------------------+
|                     Backend (FastAPI)                       |
|  - Session Router (/api/session/*)                          |
|  - AI Examiner Engine Service (LLM Prompting & Evaluator)   |
|  - Avatar Orchestrator & Audio Synthesis                    |
|  - Analytics & Event Tracker                                |
+-------------------------------------------------------------+
```

## Technology Stack
- **Frontend**: Next.js (React), TypeScript, Tailwind CSS
- **Backend**: Python FastAPI, Pydantic, Uvicorn
- **AI/LLM**: Modular LLM Service (OpenAI / Gemini API client with fallback mock mode)
- **Speech**: Web Speech API (Browser SpeechRecognition & SpeechSynthesis)
- **Avatar**: Dynamic Modular Avatar Component (`AvatarProvider` with 3D/Audio-reactive SVG/Canvas Avatar & API extension hooks)

## API Structure
- `POST /api/session/start` -> Init session with subject & difficulty -> returns initial question + session_id
- `POST /api/session/answer` -> Submit transcript answer -> returns score, feedback, follow-up question
- `POST /api/session/follow-up` -> Request adaptive follow-up
- `POST /api/session/end` -> Force complete session
- `GET  /api/session/{session_id}` -> Retrieve session state & history
- `GET  /api/session/{session_id}/result` -> Final evaluation summary & scores
- `GET  /health` -> Service health check

## AI Flow
1. Prompt receives: Subject, Current Level, Question History, Student Answer, Previous Evaluations.
2. Evaluates answer against subject benchmarks (score 1-10 on Accuracy, Clarity, Understanding).
3. Detects missing concepts or shallow answers.
4. Dynamically chooses next step: Ask deeper follow-up, pivot to related sub-topic, or adjust difficulty (Easy <-> Medium <-> Hard).
5. Compiles aggregate report on session conclusion.

## Avatar Integration Strategy
- Create an abstracted `AvatarProvider` component interface.
- Includes avatar visual presence (speaking animations, listening state, examiner expressions).
- Syncs state: `idle`, `speaking` (driven by TTS playback), `listening` (driven by mic state), `thinking` (during AI evaluation).
- Supports external avatar provider APIs (e.g. D-ID, HeyGen) while supplying a crisp, responsive, interactive local canvas/SVG avatar fallback.

## Testing Strategy
- **Backend**: Automated unit & integration tests using `pytest` & FastAPI `TestClient` for session flow, routing, and AI schemas.
- **Frontend**: Next.js build checks (`npm run build`), TypeScript typechecking, UI state navigation checks, Web Speech fallback handling.
- **Integration**: Complete end-to-end user path verification (Landing -> Subject Select -> Q&A Loop -> Final Report).

## Future Improvements
- Database persistence (Supabase / PostgreSQL) for historical user tracking.
- Audio recording upload & server-side Whisper STT for low-latency non-browser fallback.
- Advanced video avatar integration with lip-sync stream.
- Peer benchmarking and class leaderboard system.
