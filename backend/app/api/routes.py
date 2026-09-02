from fastapi import APIRouter, HTTPException, status
from app.schemas.session import (
    SessionStartRequest, SessionStartResponse,
    AnswerSubmissionRequest, AnswerSubmissionResponse,
    FollowUpRequest, EndSessionRequest,
    SessionDetailResponse, FinalResultResponse
)
from app.services.session_service import SessionService

router = APIRouter(prefix="/api/session", tags=["viva-session"])

@router.post("/start", response_model=SessionStartResponse, status_code=status.HTTP_201_CREATED)
def start_viva_session(payload: SessionStartRequest):
    """
    Initialize a new viva examination session.
    """
    try:
        return SessionService.start_session(payload.subject, payload.difficulty)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/answer", response_model=AnswerSubmissionResponse)
def submit_viva_answer(payload: AnswerSubmissionRequest):
    """
    Submit student answer to the current question.
    """
    try:
        return SessionService.submit_answer(
            session_id=payload.session_id,
            question_id=payload.question_id,
            answer_text=payload.answer_text
        )
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/follow-up", response_model=AnswerSubmissionResponse)
def request_follow_up(payload: FollowUpRequest):
    """
    Request adaptive follow-up question.
    """
    try:
        session = SessionService.get_session(payload.session_id)
        if not session.current_question:
            raise HTTPException(status_code=400, detail="No current question available.")
        # Trigger an answer submission with prompt for follow up
        return SessionService.submit_answer(
            session_id=payload.session_id,
            question_id=session.current_question.id,
            answer_text="Can you ask me a follow up question on this topic?"
        )
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))

@router.post("/end", response_model=FinalResultResponse)
def end_viva_session(payload: EndSessionRequest):
    """
    Complete session early and return final report.
    """
    try:
        return SessionService.end_session(payload.session_id)
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))

@router.get("/{session_id}", response_model=SessionDetailResponse)
def get_viva_session_detail(session_id: str):
    """
    Get current viva session details and progress.
    """
    try:
        return SessionService.get_session(session_id)
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))

@router.get("/{session_id}/result", response_model=FinalResultResponse)
def get_viva_session_result(session_id: str):
    """
    Get final viva result breakdown and feedback.
    """
    try:
        return SessionService.get_result(session_id)
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
