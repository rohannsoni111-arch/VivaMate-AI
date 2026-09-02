import React from 'react';
import { Bot, Sparkles, RefreshCw, ShieldCheck } from 'lucide-react';
import { Subject, Difficulty } from '../types/viva';

interface HeaderProps {
  currentSubject?: Subject | null;
  currentDifficulty?: Difficulty;
  onReset?: () => void;
  isVivaActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentSubject,
  currentDifficulty,
  onReset,
  isVivaActive
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                VivaMate
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sparkles className="w-2.5 h-2.5" /> AI Examiner
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Technical Viva Simulator</p>
          </div>
        </div>

        {/* Center metadata badge if in viva */}
        {isVivaActive && currentSubject && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-300">{currentSubject}</span>
            <span className="text-slate-600">•</span>
            <span className={`font-semibold ${
              currentDifficulty === 'Easy' ? 'text-emerald-400' :
              currentDifficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {currentDifficulty}
            </span>
          </div>
        )}

        {/* Right side status / actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Verified Examiner</span>
          </div>

          {onReset && (
            <button
              onClick={onReset}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Start New Viva"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
