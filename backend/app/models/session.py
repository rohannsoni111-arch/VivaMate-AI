from typing import List, Dict, Optional
from datetime import datetime
from app.schemas.session import SubjectType, DifficultyType, QuestionSchema, QuestionEvaluationSchema

class VivaSessionModel:
    def __init__(self, session_id: str, subject: SubjectType, difficulty: DifficultyType, total_questions: int = 5):
        self.session_id = session_id
        self.subject = subject
        self.difficulty = difficulty
        self.total_questions = total_questions
        self.status = "in_progress" # in_progress, completed
        self.questions: List[QuestionSchema] = []
        self.evaluations: List[QuestionEvaluationSchema] = []
        self.created_at = datetime.utcnow().isoformat()
        self.completed_at: Optional[str] = None

# In-memory session store
sessions_db: Dict[str, VivaSessionModel] = {}
