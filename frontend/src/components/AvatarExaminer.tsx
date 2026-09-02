import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Mic, Brain, Sparkles } from 'lucide-react';

interface AvatarExaminerProps {
  state: 'idle' | 'speaking' | 'listening' | 'thinking';
  questionText?: string;
  isTtsEnabled?: boolean;
  onToggleTts?: () => void;
}

export const AvatarExaminer: React.FC<AvatarExaminerProps> = ({
  state,
  questionText,
  isTtsEnabled = true,
  onToggleTts
}) => {
  const [mouthOpen, setMouthOpen] = useState(false);

  // Animate mouth when avatar is speaking
  useEffect(() => {
    if (state !== 'speaking') {
      setMouthOpen(false);
      return;
    }
    const interval = setInterval(() => {
      setMouthOpen((prev) => !prev);
    }, 220);

    return () => clearInterval(interval);
  }, [state]);

  const getStateBadge = () => {
    switch (state) {
      case 'speaking':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold animate-pulse">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Examiner Speaking...</span>
          </div>
        );
      case 'listening':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
            <Mic className="w-3.5 h-3.5 animate-bounce" />
            <span>Listening to You...</span>
          </div>
        );
      case 'thinking':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-semibold">
            <Brain className="w-3.5 h-3.5 animate-spin" />
            <span>Evaluating Answer...</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Examiner Ready</span>
          </div>
        );
    }
  };

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
      {/* Background glow effects based on state */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 pointer-events-none opacity-30 ${
          state === 'speaking' ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-600/40 via-transparent to-transparent' :
          state === 'listening' ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-600/40 via-transparent to-transparent' :
          state === 'thinking' ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-600/40 via-transparent to-transparent' :
          'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-700/20 via-transparent to-transparent'
        }`}
      />

      {/* Top Status & Controls */}
      <div className="w-full flex items-center justify-between z-10 mb-4">
        {getStateBadge()}

        {onToggleTts && (
          <button
            onClick={onToggleTts}
            className={`p-2 rounded-xl transition-all border ${
              isTtsEnabled
                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={isTtsEnabled ? 'Disable TTS Voice' : 'Enable TTS Voice'}
          >
            {isTtsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Avatar Visual Area */}
      <div className="relative w-44 h-44 sm:w-52 sm:h-52 my-2 flex items-center justify-center">
        {/* Outer Pulsing Halo */}
        <div className={`absolute inset-0 rounded-full transition-all duration-500 border ${
          state === 'speaking' ? 'border-cyan-500/50 scale-105 animate-ping' :
          state === 'listening' ? 'border-emerald-500/40 scale-105 animate-pulse' :
          state === 'thinking' ? 'border-indigo-500/50 scale-100 animate-pulse' :
          'border-slate-800'
        }`} />

        {/* Outer Ring */}
        <div className="absolute inset-2 rounded-full border border-slate-800 bg-slate-950/80 p-2 flex items-center justify-center shadow-inner">
          
          {/* Avatar Face Container */}
          <div className="relative w-full h-full rounded-full bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-700/60 flex flex-col items-center justify-center overflow-hidden">
            
            {/* Holographic grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-20" />

            {/* Stylized AI Examiner Portrait */}
            <svg className="w-32 h-32 sm:w-36 sm:h-36 z-10" viewBox="0 0 120 120" fill="none">
              <defs>
                <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Shoulders / Suit outline */}
              <path d="M 25 110 C 25 90, 40 82, 60 82 C 80 82, 95 90, 95 110 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" />
              <path d="M 45 82 L 60 96 L 75 82" stroke="#6366f1" strokeWidth="2" fill="none" />

              {/* Head shape */}
              <rect x="38" y="25" width="44" height="54" rx="22" fill="#0f172a" stroke="url(#avatarGrad)" strokeWidth="2.5" />

              {/* Hair/Headband top */}
              <path d="M 40 32 C 50 24, 70 24, 80 32" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />

              {/* Eyes */}
              <g filter="url(#glow)">
                <circle cx="48" cy="46" r="4" fill={state === 'thinking' ? '#c084fc' : '#38bdf8'} />
                <circle cx="72" cy="46" r="4" fill={state === 'thinking' ? '#c084fc' : '#38bdf8'} />
                {state === 'thinking' && (
                  <>
                    <circle cx="48" cy="46" r="6" stroke="#c084fc" strokeWidth="1" fill="none" className="animate-ping" />
                    <circle cx="72" cy="46" r="6" stroke="#c084fc" strokeWidth="1" fill="none" className="animate-ping" />
                  </>
                )}
              </g>

              {/* Eyebrows */}
              <path d="M 44 39 Q 48 37 52 39" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              <path d="M 68 39 Q 72 37 76 39" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

              {/* Glasses frame for intellectual examiner look */}
              <rect x="42" y="40" width="13" height="12" rx="3" stroke="#64748b" strokeWidth="1.5" fill="none" />
              <rect x="65" y="40" width="13" height="12" rx="3" stroke="#64748b" strokeWidth="1.5" fill="none" />
              <line x1="55" y1="46" x2="65" y2="46" stroke="#64748b" strokeWidth="1.5" />

              {/* Mouth */}
              {state === 'speaking' && mouthOpen ? (
                <ellipse cx="60" cy="65" rx="6" ry="4" fill="#38bdf8" filter="url(#glow)" />
              ) : state === 'listening' ? (
                <path d="M 54 65 Q 60 68 66 65" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              ) : (
                <line x1="54" y1="65" x2="66" y2="65" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* Audio Wave Visualizer Bars */}
      <div className="flex items-center justify-center gap-1.5 h-6 my-1">
        {[40, 75, 100, 60, 90, 45, 80, 50].map((h, idx) => (
          <div
            key={idx}
            className={`w-1 rounded-full transition-all duration-200 ${
              state === 'speaking'
                ? 'bg-cyan-400 animate-pulse'
                : state === 'listening'
                ? 'bg-emerald-400 animate-bounce'
                : state === 'thinking'
                ? 'bg-indigo-400 animate-ping'
                : 'bg-slate-800'
            }`}
            style={{
              height: state !== 'idle' ? `${Math.max(6, Math.round(h * 0.25))}px` : '4px',
              animationDelay: `${idx * 0.1}s`
            }}
          />
        ))}
      </div>

      {/* Disclaimer */}
      <p className="mt-2 text-[11px] text-slate-500 font-medium">
        AI Technical Viva Examiner • Powered by VivaMate AI Engine
      </p>
    </div>
  );
};
