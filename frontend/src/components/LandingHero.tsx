import React from 'react';
import { Subject, Difficulty } from '../types/viva';
import { Cpu, Database, Server, Network, Zap, Shield, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LandingHeroProps {
  selectedSubject: Subject | null;
  onSelectSubject: (subject: Subject) => void;
  selectedDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onStartViva: () => void;
  isLoading?: boolean;
}

const SUBJECTS: { id: Subject; title: string; description: string; icon: any; color: string; bg: string }[] = [
  {
    id: 'Machine Learning',
    title: 'Machine Learning',
    description: 'Supervised vs Unsupervised, Loss Functions, Neural Networks, Transformers & Optimization.',
    icon: Cpu,
    color: 'text-cyan-400',
    bg: 'from-cyan-500/10 to-blue-500/5 border-cyan-500/30'
  },
  {
    id: 'DBMS',
    title: 'DBMS',
    description: 'ACID properties, Normalization (3NF/BCNF), Indexing (B+ Trees), Concurrency & 2PL.',
    icon: Database,
    color: 'text-indigo-400',
    bg: 'from-indigo-500/10 to-purple-500/5 border-indigo-500/30'
  },
  {
    id: 'Operating Systems',
    title: 'Operating Systems',
    description: 'Processes & Threads, Virtual Memory, Page Faults, Scheduling & Deadlock Prevention.',
    icon: Server,
    color: 'text-emerald-400',
    bg: 'from-emerald-500/10 to-teal-500/5 border-emerald-500/30'
  },
  {
    id: 'Computer Networks',
    title: 'Computer Networks',
    description: 'TCP/IP vs OSI, Congestion Control, Routing Protocols (BGP/OSPF), Subnetting & TLS.',
    icon: Network,
    color: 'text-amber-400',
    bg: 'from-amber-500/10 to-orange-500/5 border-amber-500/30'
  }
];

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export const LandingHero: React.FC<LandingHeroProps> = ({
  selectedSubject,
  onSelectSubject,
  selectedDifficulty,
  onSelectDifficulty,
  onStartViva,
  isLoading
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" /> Interactive Technical Viva Practice
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Master Your Vivas with an <br className="hidden sm:block"/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
            AI Avatar Examiner
          </span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg">
          Simulate real-world technical oral examinations. Speak your answers aloud, receive intelligent follow-up questions, and get instant feedback.
        </p>
      </div>

      {/* Step 1: Select Subject */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">1</span>
            Select Subject
          </h2>
          <span className="text-xs text-slate-400">Choose a core CS topic</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SUBJECTS.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedSubject === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onSelectSubject(item.id)}
                className={`relative group cursor-pointer p-5 rounded-2xl border transition-all duration-300 bg-gradient-to-b ${
                  isSelected
                    ? 'bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 text-indigo-400">
                    <CheckCircle2 className="w-5 h-5 fill-indigo-400/20" />
                  </div>
                )}
                <div className={`w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4 ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Select Difficulty */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">2</span>
            Select Difficulty Level
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-xl">
          {DIFFICULTIES.map((diff) => {
            const isSelected = selectedDifficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => onSelectDifficulty(diff)}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  isSelected
                    ? diff === 'Easy'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                      : diff === 'Medium'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-300 ring-2 ring-amber-500/30'
                      : 'bg-rose-500/10 border-rose-500 text-rose-300 ring-2 ring-rose-500/30'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            );
          })}
        </div>
      </div>

      {/* Start Button */}
      <div className="flex flex-col items-center gap-3 pt-4">
        <button
          onClick={onStartViva}
          disabled={!selectedSubject || isLoading}
          className={`w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-base shadow-xl flex items-center justify-center gap-3 transition-all ${
            selectedSubject && !isLoading
              ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-600/30 hover:scale-[1.02]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          {isLoading ? (
            <span>Preparing Viva Room...</span>
          ) : (
            <>
              <span>Start Technical Viva</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
        {!selectedSubject && (
          <p className="text-xs text-amber-400/80 font-medium">Please select a subject above to begin.</p>
        )}
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-800/80">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <Zap className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-white">Dynamic AI Probing</h4>
            <p className="text-xs text-slate-400">Questions adapt to your answer depth with realistic follow-ups.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <Shield className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-white">Voice-First Experience</h4>
            <p className="text-xs text-slate-400">Practice speaking clearly using integrated Speech-to-Text.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-white">Detailed Evaluation</h4>
            <p className="text-xs text-slate-400">Receive scores, identified concept gaps, and revision guides.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
