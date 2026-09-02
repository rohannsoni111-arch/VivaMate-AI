import React, { useState } from 'react';
import { FinalResult } from '../types/viva';
import { Award, CheckCircle, XCircle, BookOpen, Target, RotateCcw, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface ResultsViewProps {
  result: FinalResult;
  onRestart: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, onRestart }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 6) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      
      {/* Top Banner */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 text-center space-y-4 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Viva Examination Completed
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Performance Evaluation Report
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Subject: <span className="text-white font-semibold">{result.subject}</span> ({result.difficulty} Level)
        </p>

        {/* Overall Score Circle */}
        <div className="pt-4 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 rounded-full bg-slate-950 border-4 border-indigo-500/40 flex flex-col items-center justify-center shadow-xl">
            <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-300">
              {result.overallScore}
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Out of 10</span>
          </div>
          <span className="mt-3 px-4 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            Rating: {result.overallPerformance}
          </span>
        </div>
      </div>

      {/* Metrics Breakdown Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Technical Accuracy', score: result.technicalAccuracyScore },
          { label: 'Conceptual Understanding', score: result.conceptualUnderstandingScore },
          { label: 'Answer Clarity', score: result.answerClarityScore },
          { label: 'Confidence & Delivery', score: result.confidenceCommunicationScore }
        ].map((item, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-medium">{item.label}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white">{item.score}</span>
              <span className="text-xs text-slate-500">/ 10</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                style={{ width: `${item.score * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Strengths & Weaknesses 2-Column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" /> Key Strengths
          </h3>
          <ul className="space-y-2.5">
            {result.strengths.map((str, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses / Improvements */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <XCircle className="w-5 h-5 text-amber-400" /> Areas for Improvement
          </h3>
          <ul className="space-y-2.5">
            {result.weaknesses.map((weak, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actionable Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" /> Topics to Revise
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.topicsToRevise.map((top, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs">
                {top}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" /> Recommended Action Steps
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {result.recommendedPractice.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Question Breakdown Accordion */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Question Breakdown & Feedback</h3>
        <div className="space-y-3">
          {result.evaluations.map((evalItem, idx) => {
            const isOpen = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center">
                      Q{idx + 1}
                    </span>
                    <span className="text-sm font-semibold text-white line-clamp-1">
                      {evalItem.questionText}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreColor(evalItem.score)}`}>
                      Score: {evalItem.score}/10
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-4 text-xs">
                    <div>
                      <span className="font-semibold text-slate-400 block mb-1">Your Answer:</span>
                      <p className="p-3 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 italic">
                        "{evalItem.studentAnswer}"
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold text-indigo-400 block mb-1">AI Examiner Feedback:</span>
                      <p className="text-slate-300 leading-relaxed">{evalItem.feedback}</p>
                    </div>

                    {evalItem.missingConcepts.length > 0 && (
                      <div>
                        <span className="font-semibold text-amber-400 block mb-1">Missing Concepts / Nuances:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {evalItem.missingConcepts.map((m, i) => (
                            <span key={i} className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Restart CTA */}
      <div className="pt-6 flex justify-center">
        <button
          onClick={onRestart}
          className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-xl shadow-indigo-600/20 flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Start Another Technical Viva
        </button>
      </div>
    </div>
  );
};
