from typing import List, Dict, Any
from app.schemas.analytics import AnalyticsEvent, AnalyticsMetricsResponse

events_log: List[AnalyticsEvent] = []

class AnalyticsService:

    @staticmethod
    def log_event(event: AnalyticsEvent):
        events_log.append(event)

    @staticmethod
    def get_metrics() -> AnalyticsMetricsResponse:
        started = sum(1 for e in events_log if e.event_name == "session_started")
        completed = sum(1 for e in events_log if e.event_name == "session_completed")
        rate = round((completed / started * 100), 1) if started > 0 else 0.0

        subjects: Dict[str, int] = {}
        difficulties: Dict[str, int] = {}

        for e in events_log:
            if e.subject:
                subjects[e.subject] = subjects.get(e.subject, 0) + 1
            if e.difficulty:
                difficulties[e.difficulty] = difficulties.get(e.difficulty, 0) + 1

        most_subject = max(subjects, key=subjects.get) if subjects else "None"

        return AnalyticsMetricsResponse(
            total_events=len(events_log),
            sessions_started=started,
            sessions_completed=completed,
            completion_rate=rate,
            subject_distribution=subjects,
            difficulty_distribution=difficulties,
            most_selected_subject=most_subject
        )
