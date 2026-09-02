import { Subject, Difficulty, Question, QuestionEvaluation, FinalResult } from '../types/viva';

const MOCK_QUESTIONS: Record<Subject, Record<Difficulty, string[]>> = {
  'Machine Learning': {
    Easy: [
      'What is supervised learning and how does it differ from unsupervised learning?',
      'Can you explain what overfitting means in a machine learning model?',
      'What is the function of an activation function in a neural network?'
    ],
    Medium: [
      'Why does increasing model complexity generally increase the risk of overfitting?',
      'Explain bias-variance tradeoff and how it impacts model generalization.',
      'How does gradient descent work to minimize the loss function?'
    ],
    Hard: [
      'Describe the architecture of a Transformer model and explain how self-attention works mathematically.',
      'How do Vanishing and Exploding gradients affect deep Recurrent Neural Networks, and what techniques mitigate them?',
      'Explain how Principal Component Analysis (PCA) performs dimensionality reduction using Eigenvalues.'
    ]
  },
  'DBMS': {
    Easy: [
      'What is ACID property in database management systems?',
      'What is the difference between Primary Key and Unique Key?',
      'What is SQL indexing and why is it used?'
    ],
    Medium: [
      'How does 3NF (Third Normal Form) differ from BCNF (Boyce-Codd Normal Form)?',
      'Explain the difference between clustered and non-clustered indexes.',
      'What is a deadlock in DBMS transactions and how can it be detected?'
    ],
    Hard: [
      'Explain two-phase locking protocol (2PL) and strict 2PL for concurrency control.',
      'How does WAL (Write-Ahead Logging) guarantee durability and atomicity during crash recovery?',
      'Explain how B+ Trees optimize range queries and disk block accesses compared to standard B-Trees.'
    ]
  },
  'Operating Systems': {
    Easy: [
      'What is a process and how is it different from a thread?',
      'What is virtual memory and why is it important?',
      'What is a system call in an operating system?'
    ],
    Medium: [
      'Explain the difference between paging and segmentation.',
      'How does the CPU scheduler handle preemptive vs non-preemptive scheduling?',
      'What is a Semaphore and how does it prevent race conditions?'
    ],
    Hard: [
      'Explain how the kernel handles a page fault trap from hardware to Disk I/O recovery.',
      'Describe the Banker\'s Algorithm for deadlock avoidance with multiple resource types.',
      'How does Copy-on-Write (COW) optimize process creation during the fork() system call?'
    ]
  },
  'Computer Networks': {
    Easy: [
      'What is the difference between TCP and UDP?',
      'What is an IP address and how does subnetting work?',
      'Explain the 7 layers of the OSI model.'
    ],
    Medium: [
      'How does the TCP 3-way handshake establish a reliable connection?',
      'What is the difference between distance-vector and link-state routing algorithms?',
      'Explain how DNS resolution works step-by-step from browser to authoritative server.'
    ],
    Hard: [
      'Explain TCP Congestion Control mechanisms (Slow Start, Congestion Avoidance, Fast Retransmit, Fast Recovery).',
      'How does BGP (Border Gateway Protocol) perform inter-domain routing across Autonomous Systems?',
      'Describe TLS 1.3 handshake optimization over TLS 1.2 and its cryptographic exchange.'
    ]
  }
};

export const startMockSession = async (subject: Subject, difficulty: Difficulty) => {
  await new Promise(r => setTimeout(r, 600)); // simulate latency
  const questions = MOCK_QUESTIONS[subject][difficulty];
  const initialQ: Question = {
    id: `q_1`,
    questionNumber: 1,
    totalQuestions: 5,
    topic: subject,
    questionText: questions[0]
  };

  return {
    sessionId: `sess_${Date.now()}`,
    initialQuestion: initialQ
  };
};

export const evaluateMockAnswer = async (
  subject: Subject,
  difficulty: Difficulty,
  question: Question,
  studentAnswer: string,
  questionNum: number
): Promise<{ evaluation: QuestionEvaluation; nextQuestion: Question | null }> => {
  await new Promise(r => setTimeout(r, 1200));

  const textLength = studentAnswer.trim().length;
  let score = textLength > 80 ? 8 : textLength > 30 ? 6 : 4;
  if (studentAnswer.toLowerCase().includes('because') || studentAnswer.toLowerCase().includes('model')) score += 1;
  score = Math.min(10, Math.max(2, score));

  const evaluation: QuestionEvaluation = {
    questionId: question.id,
    questionText: question.questionText,
    studentAnswer,
    score,
    accuracy: Math.min(10, score + 1),
    clarity: score,
    understanding: Math.max(1, score - 1),
    feedback: score >= 8
      ? 'Clear explanation! You correctly identified the core principle and used appropriate technical terminology.'
      : score >= 6
      ? 'Good attempt. You have the basic idea right, but missed a few foundational mechanisms.'
      : 'Incomplete explanation. Be sure to define key terminology and provide a concrete technical mechanism.',
    missingConcepts: score < 8 ? ['Mathematical formulation', 'Edge cases & trade-offs'] : ['Real-world optimization limits'],
    suggestedFollowUp: `Can you elaborate further on how this applies to high-scale production systems?`
  };

  if (questionNum >= 5) {
    return { evaluation, nextQuestion: null };
  }

  const pool = MOCK_QUESTIONS[subject][difficulty];
  const nextQText = pool[questionNum % pool.length] || `Follow up: How would you optimize this under strict memory constraints?`;

  const nextQuestion: Question = {
    id: `q_${questionNum + 1}`,
    questionNumber: questionNum + 1,
    totalQuestions: 5,
    topic: subject,
    questionText: nextQText,
    isFollowUp: questionNum % 2 === 1
  };

  return { evaluation, nextQuestion };
};

export const getMockFinalResult = (
  sessionId: string,
  subject: Subject,
  difficulty: Difficulty,
  evaluations: QuestionEvaluation[]
): FinalResult => {
  const avgScore = evaluations.length > 0
    ? Math.round(evaluations.reduce((acc, e) => acc + e.score, 0) / evaluations.length * 10) / 10
    : 7.5;

  return {
    sessionId,
    subject,
    difficulty,
    overallScore: avgScore,
    technicalAccuracyScore: Math.min(10, Math.round((avgScore + 0.3) * 10) / 10),
    conceptualUnderstandingScore: Math.min(10, Math.round((avgScore - 0.2) * 10) / 10),
    answerClarityScore: Math.min(10, Math.round(avgScore * 10) / 10),
    confidenceCommunicationScore: Math.min(10, Math.round((avgScore + 0.5) * 10) / 10),
    overallPerformance: avgScore >= 8 ? 'Outstanding' : avgScore >= 6 ? 'Proficient' : 'Needs Practice',
    strengths: [
      'Solid grasp of core definitions and architectural concepts',
      'Logical sequence when explaining step-by-step mechanisms',
      'Effective usage of technical terminology'
    ],
    weaknesses: [
      'Depth on edge cases and failure mode handling',
      'Mathematical rigor under follow-up probing'
    ],
    topicsToRevise: [
      `${subject} - Advanced Optimization Techniques`,
      `${subject} - System Trade-offs and Concurrency Control`
    ],
    recommendedPractice: [
      'Practice speaking answers out loud within 60-second timer limits',
      'Focus on defining the core mechanism before elaborating on examples'
    ],
    evaluations,
    completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
};
