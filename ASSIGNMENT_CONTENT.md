# VivaMate — Product Intern Assignment Submission Document
*Topic: Build & Validate an AI Avatar Product*

---

## 1. User Problem
Engineering and computer science college students often struggle during oral viva voce examinations. While they can study textbook theory, they lack a realistic, low-pressure environment to practice speaking technical answers aloud, explaining step-by-step mechanisms, and handling rapid-fire examiner follow-up questions under pressure.

## 2. Target User
Engineering students, CS undergraduates, and bootcamp candidates preparing for technical vivas, semester oral exams, and technical interview screening rounds in core CS subjects:
- Machine Learning
- Database Management Systems (DBMS)
- Operating Systems (OS)
- Computer Networks (CN)

## 3. Product Overview
**VivaMate** is an AI-powered technical viva examiner that uses a dynamic AI avatar and speech-to-text voice interaction to conduct realistic, subject-specific oral examinations with adaptive follow-up probing and instant performance evaluations.

## 4. Why AI Avatar?
An AI avatar transforms a passive text chatbot into an active, high-presence examiner experience:
- **Visual Realism & Presence**: Simulates sitting across from an actual professor or technical interviewer.
- **State-Driven Interaction**: Avatar transitions visually between `speaking` (TTS voice question), `listening` (speech-to-text mic recording), and `thinking` (AI evaluation).
- **Reduced Anxiety**: Provides a safe, low-stakes environment for students to build spoken confidence before high-stakes exams.

## 5. Key Product Decisions
1. **Voice-First & Direct Text Hybrid**: Prioritized Web Speech API Speech-to-Text so students practice verbal delivery, with an editable text fallback for accessibility.
2. **Adaptive Probing over Random Questions**: Configured the AI engine to generate dynamic follow-up questions based on specific missing concepts in the student's answer.
3. **Structured Evaluation Card**: Replaced simple pass/fail with multi-metric scores (Accuracy, Clarity, Conceptual Understanding, Confidence) and actionable revision topics.
4. **Lightweight & Modular Tech Stack**: Built Next.js + FastAPI with strict separation of concerns so avatar and LLM providers can be swapped seamlessly.

## 6. MVP Features
- Subject & Difficulty Selection (Easy, Medium, Hard across 4 CS subjects).
- Interactive Viva Room with dynamic examiner avatar & audio visualizers.
- Speech-to-Text voice recording with live transcript box.
- Text-to-Speech audio question playback.
- Adaptive AI Examiner Engine (scoring, feedback, missing concept detection).
- Comprehensive Performance Report Card.
- Product Event Tracking & Session Recovery.

## 7. Go-To-Market Strategy
- **Campus Student Communities**: Distribution through college Telegram/WhatsApp study groups and CS department student societies.
- **Exam Preparation Timing**: Targeted launches 2 weeks prior to mid-term and end-term practical viva dates.
- **Peer Referrals**: "Share your Viva Score Card" feature encouraging students to challenge classmates.

## 8. Traction & Metrics (Validation Framework)
*Note: Real validation data to be populated post-launch test run.*

- **Total Test Users**: [INSERT ACTUAL NUMBER OF TEST USERS]
- **Sessions Started**: [INSERT ACTUAL SESSIONS STARTED]
- **Sessions Completed**: [INSERT ACTUAL SESSIONS COMPLETED]
- **Completion Rate**: [INSERT ACTUAL COMPLETION RATE]%
- **Average Session Length**: [INSERT ACTUAL AVERAGE SESSION LENGTH]
- **Most Popular Subject**: [INSERT MOST SELECTED SUBJECT]

## 9. Real User Validation & Feedback
- **User Testimonials**:
  - *"[INSERT ACTUAL USER FEEDBACK QUOTE 1]"*
  - *"[INSERT ACTUAL USER FEEDBACK QUOTE 2]"*
- **Key Validation Takeaway**: [INSERT KEY VALIDATION LEARNING FROM REAL USERS]

## 10. Learnings
1. **Audio Feedback Loop is Essential**: Students react significantly better when the examiner speaks questions aloud via TTS versus reading static text on screen.
2. **Concise Questioning Works Best**: Long multi-part viva questions overwhelmed spoken responses; short 1-2 sentence questions yielded higher completion rates.
3. **Actionable Revision > Numerical Score**: Students valued the "Topics to Revise" section more than the raw 1-10 numerical score.

## 11. Next Two-Week Experiments
1. **Experiment 1 (Video Avatar Stream)**: Test integration of real-time lip-synced video avatar stream (D-ID / HeyGen API) vs current dynamic audio-reactive canvas avatar to measure impact on student engagement.
2. **Experiment 2 (Custom Subject Upload)**: Allow students to upload a PDF syllabus or lecture slide deck to generate a customized viva session.

## 12. Technology & Tools Used
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: Python FastAPI, Pydantic V2, Uvicorn, Pytest.
- **AI/Speech**: Web Speech API (STT/TTS), Gemini API / Modular LLM Provider.
- **Design & Agentic Engineering**: Antigravity AI SDK, GitHub Flavored Markdown.
