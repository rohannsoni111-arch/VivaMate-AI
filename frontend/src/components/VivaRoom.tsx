import React, { useState, useEffect, useRef } from 'react';
import { AvatarProvider } from './avatar/AvatarProvider';
import { Question, Subject, Difficulty } from '../types/viva';
import { Mic, MicOff, Send, HelpCircle, AlertCircle, LogOut, CheckCircle2, Volume2, RotateCcw } from 'lucide-react';

interface VivaRoomProps {
  subject: Subject;
  difficulty: Difficulty;
  currentQuestion: Question;
  isEvaluating: boolean;
  onSubmitAnswer: (answer: string) => void;
  onEndViva: () => void;
}

export const VivaRoom: React.FC<VivaRoomProps> = ({
  subject,
  difficulty,
  currentQuestion,
  isEvaluating,
  onSubmitAnswer,
  onEndViva
}) => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(true);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Initialize Web Speech API synthesis for Avatar speaking
  const speakQuestion = (text: string) => {
    if (!isTtsEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsAvatarSpeaking(false);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any active speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsAvatarSpeaking(true);
      utterance.onend = () => setIsAvatarSpeaking(false);
      utterance.onerror = () => setIsAvatarSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsAvatarSpeaking(false);
    }
  };

  // Speak question when currentQuestion changes
  useEffect(() => {
    setIsAvatarSpeaking(true);
    setTranscript('');
    const t = setTimeout(() => {
      speakQuestion(currentQuestion.questionText);
    }, 400);

    return () => {
      clearTimeout(t);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentQuestion.id, isTtsEnabled]);

  // Handle Recording Timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Speech Recognition handler
  const toggleRecording = () => {
    setSpeechError(null);
    if (isRecording) {
      // Stop recording
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsRecording(false);
      return;
    }

    // Stop TTS if speaking
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsAvatarSpeaking(false);
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('Browser Speech Recognition not supported in this browser. Please type your response below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        setIsRecording(false);
        if (event.error !== 'no-speech') {
          setSpeechError(`Speech error: ${event.error}. You can continue by typing.`);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setIsRecording(false);
      setSpeechError('Could not access microphone. Please type your answer.');
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!transcript.trim() || isEvaluating) return;

    if (isRecording) {
      toggleRecording();
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    onSubmitAnswer(transcript);
  };

  const progressPercent = Math.round((currentQuestion.questionNumber / currentQuestion.totalQuestions) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
            {subject}
          </span>
          <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${
            difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
            difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
            'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            {difficulty} Level
          </span>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs font-semibold text-slate-300">
              Question {currentQuestion.questionNumber} of {currentQuestion.totalQuestions}
            </span>
            <span className="text-[11px] text-slate-500">{progressPercent}% Completed</span>
          </div>
          <div className="w-24 sm:w-32 h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <button
            onClick={() => setShowConfirmEnd(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-500/20"
            title="End Viva Session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Avatar Visualizer & Right Question/Response Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Examiner Avatar (5 Columns on Large Screens) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <AvatarProvider
            providerType="local_mock"
            state={
              isEvaluating
                ? 'thinking'
                : isAvatarSpeaking
                ? 'speaking'
                : isRecording
                ? 'listening'
                : 'idle'
            }
            questionText={currentQuestion.questionText}
            isTtsEnabled={isTtsEnabled}
            onToggleTts={() => setIsTtsEnabled(!isTtsEnabled)}
          />

          {/* Tips / Info Box */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-300">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Examiner Guidance</span>
            </div>
            <p>
              Speak naturally as if sitting in an offline technical viva. Explain the underlying mechanism, key terminology, and real-world trade-offs.
            </p>
          </div>
        </div>

        {/* Question & Response Interface (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* Question Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-4 shadow-xl relative">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
                {currentQuestion.isFollowUp ? 'Adaptive Follow-Up Question' : 'Primary Technical Question'}
              </span>
              <button
                onClick={() => speakQuestion(currentQuestion.questionText)}
                className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                title="Re-read Question"
              >
                <Volume2 className="w-3.5 h-3.5" /> Re-play Audio
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
              "{currentQuestion.questionText}"
            </h2>
          </div>

          {/* Student Response Area */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <span>Your Verbal Answer</span>
                  {isRecording && (
                    <span className="inline-flex items-center gap-1 text-xs text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      REC {recordingSeconds}s
                    </span>
                  )}
                </label>

                {transcript && (
                  <button
                    onClick={() => setTranscript('')}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>

              {/* Text Input / Transcript Display */}
              <div className="relative">
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder={
                    isRecording
                      ? 'Listening to your voice... (speak now)'
                      : 'Click the microphone button to speak your answer, or type here directly...'
                  }
                  rows={5}
                  disabled={isEvaluating}
                  className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              {speechError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{speechError}</span>
                </div>
              )}
            </div>

            {/* Microphone & Submit Action Controls */}
            <div className="flex items-center gap-3 pt-2">
              {/* Mic Toggle Button */}
              <button
                type="button"
                onClick={toggleRecording}
                disabled={isEvaluating}
                className={`p-3.5 rounded-xl border font-semibold flex items-center justify-center gap-2 transition-all ${
                  isRecording
                    ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
                title={isRecording ? 'Stop Recording' : 'Start Voice Recording'}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-indigo-400" />}
                <span className="text-sm hidden sm:inline">
                  {isRecording ? 'Stop Recording' : 'Speak Answer'}
                </span>
              </button>

              {/* Submit Button */}
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!transcript.trim() || isEvaluating}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all ${
                  transcript.trim() && !isEvaluating
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-600/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
                }`}
              >
                {isEvaluating ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
                    AI Evaluating Answer...
                  </span>
                ) : (
                  <>
                    <span>Submit Answer</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm End Viva Modal */}
      {showConfirmEnd && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">End Viva Session Early?</h3>
            <p className="text-xs text-slate-400">
              Ending now will generate your performance evaluation report based on the questions answered so far.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmEnd(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
              >
                Continue Viva
              </button>
              <button
                onClick={() => {
                  setShowConfirmEnd(false);
                  onEndViva();
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500"
              >
                End & View Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
