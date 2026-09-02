import uuid
from datetime import datetime
from typing import Optional, List, Dict
from app.models.session import sessions_db, VivaSessionModel
from app.schemas.session import (
    SubjectType, DifficultyType, QuestionSchema, QuestionEvaluationSchema,
    SessionStartResponse, AnswerSubmissionResponse, FinalResultResponse, SessionDetailResponse
)
from app.services.ai_examiner_service import AIExaminerService

QUESTION_BANK: Dict[SubjectType, Dict[DifficultyType, List[str]]] = {
    "Machine Learning": {
        "Easy": [
            "What is supervised learning and how does it differ from unsupervised learning?",
            "Can you explain what overfitting means in a machine learning model?",
            "What is the function of an activation function in a neural network?"
        ],
        "Medium": [
            "Why does increasing model complexity generally increase the risk of overfitting?",
            "Explain bias-variance tradeoff and how it impacts model generalization.",
            "How does gradient descent work to minimize the loss function?"
        ],
        "Hard": [
            "Describe the architecture of a Transformer model and explain how self-attention works mathematically.",
            "How do Vanishing and Exploding gradients affect deep Recurrent Neural Networks, and what techniques mitigate them?",
            "Explain how Principal Component Analysis (PCA) performs dimensionality reduction using Eigenvalues."
        ]
    },
    "DBMS": {
        "Easy": [
            "What is ACID property in database management systems?",
            "What is the difference between Primary Key and Unique Key?",
            "What is SQL indexing and why is it used?"
        ],
        "Medium": [
            "How does 3NF differ from BCNF?",
            "Explain the difference between clustered and non-clustered indexes.",
            "What is a deadlock in DBMS transactions and how can it be detected?"
        ],
        "Hard": [
            "Explain two-phase locking protocol (2PL) and strict 2PL for concurrency control.",
            "How does Write-Ahead Logging (WAL) guarantee durability and atomicity during crash recovery?",
            "Explain how B+ Trees optimize range queries compared to standard B-Trees."
        ]
    },
    "Operating Systems": {
        "Easy": [
            "What is a process and how is it different from a thread?",
            "What is virtual memory and why is it important?",
            "What is a system call in an operating system?"
        ],
        "Medium": [
            "Explain the difference between paging and segmentation.",
            "How does the CPU scheduler handle preemptive vs non-preemptive scheduling?",
            "What is a Semaphore and how does it prevent race conditions?"
        ],
        "Hard": [
            "Explain how the kernel handles a page fault trap from hardware to Disk I/O recovery.",
            "Describe the Banker's Algorithm for deadlock avoidance with multiple resource types.",
            "How does Copy-on-Write (COW) optimize process creation during the fork() system call?"
        ]
    },
    "Computer Networks": {
        "Easy": [
            "What is the difference between TCP and UDP?",
            "What is an IP address and how does subnetting work?",
            "Explain the 7 layers of the OSI model."
        ],
        "Medium": [
            "How does the TCP 3-way handshake establish a reliable connection?",
            "What is the difference between distance-vector and link-state routing algorithms?",
            "Explain how DNS resolution works step-by-step from browser to authoritative server."
        ],
        "Hard": [
            "Explain TCP Congestion Control mechanisms (Slow Start, Congestion Avoidance, Fast Retransmit, Fast Recovery).",
            "How does BGP (Border Gateway Protocol) perform inter-domain routing across Autonomous Systems?",
            "Describe TLS 1.3 handshake optimization over TLS 1.2 and its cryptographic exchange."
        ]
    }
}

class SessionService:

    @staticmethod
    def start_session(subject: SubjectType, difficulty: DifficultyType) -> SessionStartResponse:
        session_id = f"sess_{uuid.uuid4().hex[:10]}"
        session = VivaSessionModel(session_id=session_id, subject=subject, difficulty=difficulty)
        
        initial_q_text = QUESTION_BANK[subject][difficulty][0]
        initial_q = QuestionSchema(
            id="q_1",
            question_number=1,
            total_questions=session.total_questions,
            topic=subject,
            question_text=initial_q_text,
            is_follow_up=False
        )
        session.questions.append(initial_q)
        sessions_db[session_id] = session

        return SessionStartResponse(
            session_id=session_id,
            subject=subject,
            difficulty=difficulty,
            initial_question=initial_q
        )

    @staticmethod
    def submit_answer(session_id: str, question_id: str, answer_text: str) -> AnswerSubmissionResponse:
        if session_id not in sessions_db:
            raise ValueError(f"Session '{session_id}' not found.")

        session = sessions_db[session_id]
        current_q = next((q for q in session.questions if q.id == question_id), None)
        if not current_q:
            current_q = session.questions[-1]

        # Call AI Examiner Service for dynamic evaluation
        history = [
            {"q": e.question_text, "a": e.student_answer, "score": e.score}
            for e in session.evaluations
        ]
        ai_res = AIExaminerService.evaluate_student_answer(
            subject=session.subject,
            difficulty=session.difficulty,
            question_text=current_q.question_text,
            student_answer=answer_text,
            session_history=history
        )

        evaluation = QuestionEvaluationSchema(
            question_id=current_q.id,
            question_text=current_q.question_text,
            student_answer=answer_text,
            score=ai_res["score"],
            accuracy=ai_res["accuracy"],
            clarity=ai_res["clarity"],
            understanding=ai_res["understanding"],
            feedback=ai_res["feedback"],
            missing_concepts=ai_res["missing_concepts"],
            suggested_follow_up=ai_res["follow_up_question"],
            difficulty_adjustment=ai_res["difficulty_adjustment"]
        )
        session.evaluations.append(evaluation)

        q_num = len(session.questions)
        if q_num >= session.total_questions:
            session.status = "completed"
            session.completed_at = datetime.utcnow().strftime("%H:%M:%S")
            return AnswerSubmissionResponse(
                evaluation=evaluation,
                next_question=None,
                is_session_complete=True
            )

        # Dynamic Next Question Selection (Adaptive Follow-up or Next core question)
        if ai_res["follow_up_question"] and q_num % 2 == 1:
            next_q_text = ai_res["follow_up_question"]
            is_follow = True
        else:
            pool = QUESTION_BANK[session.subject][session.difficulty]
            next_q_text = pool[q_num % len(pool)]
            is_follow = False

        next_q = QuestionSchema(
            id=f"q_{q_num + 1}",
            question_number=q_num + 1,
            total_questions=session.total_questions,
            topic=session.subject,
            question_text=next_q_text,
            is_follow_up=is_follow
        )
        session.questions.append(next_q)

        return AnswerSubmissionResponse(
            evaluation=evaluation,
            next_question=next_q,
            is_session_complete=False
        )

    @staticmethod
    def end_session(session_id: str) -> FinalResultResponse:
        if session_id not in sessions_db:
            raise ValueError(f"Session '{session_id}' not found.")
        session = sessions_db[session_id]
        session.status = "completed"
        session.completed_at = datetime.utcnow().strftime("%H:%M:%S")
        return SessionService.get_result(session_id)

    @staticmethod
    def get_session(session_id: str) -> SessionDetailResponse:
        if session_id not in sessions_db:
            raise ValueError(f"Session '{session_id}' not found.")
        session = sessions_db[session_id]
        current_q = session.questions[-1] if session.questions else None
        return SessionDetailResponse(
            session_id=session.session_id,
            subject=session.subject,
            difficulty=session.difficulty,
            status=session.status,
            questions_answered=len(session.evaluations),
            total_questions=session.total_questions,
            current_question=current_q
        )

    @staticmethod
    def get_result(session_id: str) -> FinalResultResponse:
        if session_id not in sessions_db:
            raise ValueError(f"Session '{session_id}' not found.")
        session = sessions_db[session_id]
        evals = session.evaluations
        eval_dicts = [e.model_dump() for e in evals]

        report = AIExaminerService.generate_final_report(
            subject=session.subject,
            difficulty=session.difficulty,
            evaluations=eval_dicts
        )

        return FinalResultResponse(
            session_id=session.session_id,
            subject=session.subject,
            difficulty=session.difficulty,
            overall_score=report["overall_score"],
            technical_accuracy_score=min(10.0, round(report["overall_score"] + 0.3, 1)),
            conceptual_understanding_score=min(10.0, round(report["overall_score"] - 0.2, 1)),
            answer_clarity_score=min(10.0, report["overall_score"]),
            confidence_communication_score=min(10.0, round(report["overall_score"] + 0.4, 1)),
            overall_performance=report["overall_performance"],
            strengths=report["strengths"],
            weaknesses=report["weaknesses"],
            topics_to_revise=report["topics_to_revise"],
            recommended_practice=report["recommended_practice"],
            evaluations=evals,
            completed_at=session.completed_at or datetime.utcnow().strftime("%H:%M:%S")
        )
