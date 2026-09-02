from pydantic import BaseModel, Field
from typing import List, Optional, Literal

SubjectType = Literal['Machine Learning', 'DBMS', 'Operating Systems', 'Computer Networks']
DifficultyType = Literal['Easy', 'Medium', 'Hard']

class SessionStartRequest(BaseModel):
    subject: SubjectType
    difficulty: DifficultyType

class QuestionSchema(BaseModel):
    id: str
    question_number: int
    total_questions: int
    topic: str
    question_text: str
    is_follow_up: bool = False

class SessionStartResponse(BaseModel):
    session_id: str
    subject: SubjectType
    difficulty: DifficultyType
    initial_question: QuestionSchema

class AnswerSubmissionRequest(BaseModel):
    session_id: str
    question_id: str
    answer_text: str

class QuestionEvaluationSchema(BaseModel):
    question_id: str
    question_text: str
    student_answer: str
    score: int
    accuracy: int
    clarity: int
    understanding: int
    feedback: str
    missing_concepts: List[str] = []
    suggested_follow_up: Optional[str] = None
    difficulty_adjustment: Optional[str] = "same"

class AnswerSubmissionResponse(BaseModel):
    evaluation: QuestionEvaluationSchema
    next_question: Optional[QuestionSchema] = None
    is_session_complete: bool = False

class FollowUpRequest(BaseModel):
    session_id: str

class EndSessionRequest(BaseModel):
    session_id: str

class FinalResultResponse(BaseModel):
    session_id: str
    subject: SubjectType
    difficulty: DifficultyType
    overall_score: float
    technical_accuracy_score: float
    conceptual_understanding_score: float
    answer_clarity_score: float
    confidence_communication_score: float
    overall_performance: str
    strengths: List[str]
    weaknesses: List[str]
    topics_to_revise: List[str]
    recommended_practice: List[str]
    evaluations: List[QuestionEvaluationSchema]
    completed_at: str

class SessionDetailResponse(BaseModel):
    session_id: str
    subject: SubjectType
    difficulty: DifficultyType
    status: str
    questions_answered: int
    total_questions: int
    current_question: Optional[QuestionSchema] = None
