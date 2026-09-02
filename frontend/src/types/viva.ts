export type Subject = 'Machine Learning' | 'DBMS' | 'Operating Systems' | 'Computer Networks';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  id: string;
  questionNumber: number;
  totalQuestions: number;
  topic: string;
  questionText: string;
  isFollowUp?: boolean;
}

export interface QuestionEvaluation {
  questionId: string;
  questionText: string;
  studentAnswer: string;
  score: number; // 1 - 10
  accuracy: number;
  clarity: number;
  understanding: number;
  feedback: string;
  missingConcepts: string[];
  suggestedFollowUp?: string;
  difficultyAdjustment?: 'easier' | 'same' | 'harder';
}

export interface FinalResult {
  sessionId: string;
  subject: Subject;
  difficulty: Difficulty;
  overallScore: number;
  technicalAccuracyScore: number;
  conceptualUnderstandingScore: number;
  answerClarityScore: number;
  confidenceCommunicationScore: number;
  overallPerformance: string;
  strengths: string[];
  weaknesses: string[];
  topicsToRevise: string[];
  recommendedPractice: string[];
  evaluations: QuestionEvaluation[];
  completedAt: string;
}

export interface VivaState {
  step: 'landing' | 'setup' | 'viva' | 'evaluating' | 'results';
  subject: Subject | null;
  difficulty: Difficulty;
  sessionId: string | null;
  currentQuestion: Question | null;
  currentAnswer: string;
  isRecording: boolean;
  isAvatarSpeaking: boolean;
  questionHistory: Question[];
  evaluationsHistory: QuestionEvaluation[];
  finalResult: FinalResult | null;
  errorMessage: string | null;
}
