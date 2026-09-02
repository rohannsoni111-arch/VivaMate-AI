'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { LandingHero } from '@/components/LandingHero';
import { VivaRoom } from '@/components/VivaRoom';
import { ResultsView } from '@/components/ResultsView';
import { Subject, Difficulty, VivaState } from '@/types/viva';
import { startVivaSession, submitVivaAnswer, fetchFinalResult } from '@/services/apiViva';

const LOCAL_STORAGE_KEY = 'vivamate_active_session_v1';

export default function Home() {
  const [state, setState] = useState<VivaState>({
    step: 'landing',
    subject: 'Machine Learning',
    difficulty: 'Medium',
    sessionId: null,
    currentQuestion: null,
    currentAnswer: '',
    isRecording: false,
    isAvatarSpeaking: false,
    questionHistory: [],
    evaluationsHistory: [],
    finalResult: null,
    errorMessage: null
  });

  const [isLoading, setIsLoading] = useState(false);

  // Restore session from localStorage on initial load
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.step === 'viva' || parsed.step === 'results')) {
          setState(parsed);
        }
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  // Save session state to localStorage whenever state changes
  useEffect(() => {
    try {
      if (state.step === 'viva' || state.step === 'results') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (e) {}
  }, [state]);

  // Start Viva Session
  const handleStartViva = async () => {
    if (!state.subject) return;
    setIsLoading(true);
    try {
      const res = await startVivaSession(state.subject, state.difficulty);
      setState((prev) => ({
        ...prev,
        step: 'viva',
        sessionId: res.sessionId,
        currentQuestion: res.initialQuestion,
        questionHistory: [res.initialQuestion],
        evaluationsHistory: [],
        finalResult: null,
        errorMessage: null
      }));
    } catch (err) {
      setState((prev) => ({ ...prev, errorMessage: 'Failed to start viva session' }));
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Student Answer
  const handleSubmitAnswer = async (answerText: string) => {
    if (!state.currentQuestion || !state.subject || !state.sessionId) return;
    
    setIsLoading(true);
    const qNum = state.currentQuestion.questionNumber;

    try {
      const { evaluation, nextQuestion } = await submitVivaAnswer(
        state.sessionId,
        state.currentQuestion.id,
        answerText,
        state.subject,
        state.difficulty,
        qNum,
        state.currentQuestion
      );

      const updatedEvals = [...state.evaluationsHistory, evaluation];

      if (nextQuestion) {
        setState((prev) => ({
          ...prev,
          currentQuestion: nextQuestion,
          questionHistory: [...prev.questionHistory, nextQuestion],
          evaluationsHistory: updatedEvals,
          currentAnswer: ''
        }));
      } else {
        // Complete viva session & fetch aggregate report
        const finalRes = await fetchFinalResult(
          state.sessionId,
          state.subject,
          state.difficulty,
          updatedEvals
        );
        setState((prev) => ({
          ...prev,
          step: 'results',
          evaluationsHistory: updatedEvals,
          finalResult: finalRes
        }));
      }
    } catch (err) {
      setState((prev) => ({ ...prev, errorMessage: 'Error processing student answer' }));
    } finally {
      setIsLoading(false);
    }
  };

  // End Viva Early
  const handleEndVivaEarly = async () => {
    if (!state.sessionId || !state.subject) {
      handleReset();
      return;
    }
    setIsLoading(true);
    try {
      const finalRes = await fetchFinalResult(
        state.sessionId,
        state.subject,
        state.difficulty,
        state.evaluationsHistory
      );
      setState((prev) => ({
        ...prev,
        step: 'results',
        finalResult: finalRes
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to Landing Page
  const handleReset = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setState({
      step: 'landing',
      subject: 'Machine Learning',
      difficulty: 'Medium',
      sessionId: null,
      currentQuestion: null,
      currentAnswer: '',
      isRecording: false,
      isAvatarSpeaking: false,
      questionHistory: [],
      evaluationsHistory: [],
      finalResult: null,
      errorMessage: null
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        currentSubject={state.subject}
        currentDifficulty={state.difficulty}
        onReset={handleReset}
        isVivaActive={state.step === 'viva'}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {state.step === 'landing' && (
          <LandingHero
            selectedSubject={state.subject}
            onSelectSubject={(subj: Subject) => setState((p) => ({ ...p, subject: subj }))}
            selectedDifficulty={state.difficulty}
            onSelectDifficulty={(diff: Difficulty) => setState((p) => ({ ...p, difficulty: diff }))}
            onStartViva={handleStartViva}
            isLoading={isLoading}
          />
        )}

        {state.step === 'viva' && state.currentQuestion && state.subject && (
          <VivaRoom
            subject={state.subject}
            difficulty={state.difficulty}
            currentQuestion={state.currentQuestion}
            isEvaluating={isLoading}
            onSubmitAnswer={handleSubmitAnswer}
            onEndViva={handleEndVivaEarly}
          />
        )}

        {state.step === 'results' && state.finalResult && (
          <ResultsView
            result={state.finalResult}
            onRestart={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>VivaMate — AI Avatar Technical Viva Examiner</span>
          <span>Polished MVP • Session Recovery & AI Disclosures Active</span>
        </div>
      </footer>
    </div>
  );
}
