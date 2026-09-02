import { Subject, Difficulty, Question, QuestionEvaluation, FinalResult } from '../types/viva';
import { startMockSession, evaluateMockAnswer, getMockFinalResult } from './mockViva';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:8000/api' : '/api/backend/api');

export const startVivaSession = async (subject: Subject, difficulty: Difficulty) => {
  try {
    const res = await fetch(`${API_BASE_URL}/session/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, difficulty }),
    });

    if (!res.ok) throw new Error('API server returned error');
    const data = await res.json();

    const initialQ: Question = {
      id: data.initial_question.id,
      questionNumber: data.initial_question.question_number,
      totalQuestions: data.initial_question.total_questions,
      topic: data.initial_question.topic,
      questionText: data.initial_question.question_text,
      isFollowUp: data.initial_question.is_follow_up
    };

    return {
      sessionId: data.session_id,
      initialQuestion: initialQ
    };
  } catch (err) {
    console.warn('Backend API unavailable. Falling back to frontend engine:', err);
    return startMockSession(subject, difficulty);
  }
};

export const submitVivaAnswer = async (
  sessionId: string,
  questionId: string,
  answerText: string,
  subject: Subject,
  difficulty: Difficulty,
  questionNum: number,
  currentQ: Question
): Promise<{ evaluation: QuestionEvaluation; nextQuestion: Question | null }> => {
  try {
    const res = await fetch(`${API_BASE_URL}/session/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        question_id: questionId,
        answer_text: answerText
      }),
    });

    if (!res.ok) throw new Error('API server returned error');
    const data = await res.json();

    const evaluation: QuestionEvaluation = {
      questionId: data.evaluation.question_id,
      questionText: data.evaluation.question_text,
      studentAnswer: data.evaluation.student_answer,
      score: data.evaluation.score,
      accuracy: data.evaluation.accuracy,
      clarity: data.evaluation.clarity,
      understanding: data.evaluation.understanding,
      feedback: data.evaluation.feedback,
      missingConcepts: data.evaluation.missing_concepts,
      suggestedFollowUp: data.evaluation.suggested_follow_up,
      difficultyAdjustment: data.evaluation.difficulty_adjustment
    };

    let nextQ: Question | null = null;
    if (data.next_question) {
      nextQ = {
        id: data.next_question.id,
        questionNumber: data.next_question.question_number,
        totalQuestions: data.next_question.total_questions,
        topic: data.next_question.topic,
        questionText: data.next_question.question_text,
        isFollowUp: data.next_question.is_follow_up
      };
    }

    return { evaluation, nextQuestion: nextQ };
  } catch (err) {
    console.warn('Backend API answer error. Falling back to local evaluator:', err);
    return evaluateMockAnswer(subject, difficulty, currentQ, answerText, questionNum);
  }
};

export const fetchFinalResult = async (
  sessionId: string,
  subject: Subject,
  difficulty: Difficulty,
  evaluations: QuestionEvaluation[]
): Promise<FinalResult> => {
  try {
    const res = await fetch(`${API_BASE_URL}/session/${sessionId}/result`);
    if (!res.ok) throw new Error('API server returned error');
    const data = await res.json();

    return {
      sessionId: data.session_id,
      subject: data.subject,
      difficulty: data.difficulty,
      overallScore: data.overall_score,
      technicalAccuracyScore: data.technical_accuracy_score,
      conceptualUnderstandingScore: data.conceptual_understanding_score,
      answerClarityScore: data.answer_clarity_score,
      confidenceCommunicationScore: data.confidence_communication_score,
      overallPerformance: data.overall_performance,
      strengths: data.strengths,
      weaknesses: data.weaknesses,
      topicsToRevise: data.topics_to_revise,
      recommendedPractice: data.recommended_practice,
      evaluations: data.evaluations.map((e: any) => ({
        questionId: e.question_id,
        questionText: e.question_text,
        studentAnswer: e.student_answer,
        score: e.score,
        accuracy: e.accuracy,
        clarity: e.clarity,
        understanding: e.understanding,
        feedback: e.feedback,
        missingConcepts: e.missing_concepts,
        suggestedFollowUp: e.suggested_follow_up,
        difficultyAdjustment: e.difficulty_adjustment
      })),
      completedAt: data.completed_at
    };
  } catch (err) {
    console.warn('Backend API result error. Falling back to local report:', err);
    return getMockFinalResult(sessionId, subject, difficulty, evaluations);
  }
};
