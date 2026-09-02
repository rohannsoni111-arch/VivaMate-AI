from fastapi import APIRouter
from app.schemas.analytics import AnalyticsEvent, AnalyticsMetricsResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.post("/event")
def record_event(event: AnalyticsEvent):
    AnalyticsService.log_event(event)
    return {"status": "event_logged"}

@router.get("/metrics", response_model=AnalyticsMetricsResponse)
def get_analytics_metrics():
    return AnalyticsService.get_metrics()
