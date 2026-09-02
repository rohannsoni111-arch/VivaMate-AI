from pydantic import BaseModel
from typing import Dict, Any, Optional

class AnalyticsEvent(BaseModel):
    event_name: str
    session_id: Optional[str] = None
    subject: Optional[str] = None
    difficulty: Optional[str] = None
    payload: Optional[Dict[str, Any]] = None

class AnalyticsMetricsResponse(BaseModel):
    total_events: int
    sessions_started: int
    sessions_completed: int
    completion_rate: float
    subject_distribution: Dict[str, int]
    difficulty_distribution: Dict[str, int]
    most_selected_subject: str
