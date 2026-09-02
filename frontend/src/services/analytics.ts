const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:8000/api' : '/api/backend/api');

export interface EventPayload {
  eventName: 'session_started' | 'answer_submitted' | 'follow_up_generated' | 'session_completed' | 'result_viewed' | 'session_restarted';
  sessionId?: string | null;
  subject?: string | null;
  difficulty?: string | null;
  meta?: Record<string, any>;
}

export const trackEvent = (event: EventPayload) => {
  try {
    const logItem = {
      event_name: event.eventName,
      session_id: event.sessionId,
      subject: event.subject,
      difficulty: event.difficulty,
      payload: event.meta,
      timestamp: new Date().toISOString()
    };

    // Save locally
    const existing = JSON.parse(localStorage.getItem('vivamate_events_v1') || '[]');
    existing.push(logItem);
    localStorage.setItem('vivamate_events_v1', JSON.stringify(existing));

    // Send to backend async
    fetch(`${API_BASE_URL}/analytics/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logItem)
    }).catch(() => {});
  } catch (e) {}
};
