
import React, { useState, useEffect, useRef } from 'react';
import { GameResult } from '../types';
import { useOrientation, TiltAction } from '../hooks/useOrientation';

interface GameScreenProps {
  words: string[];
  duration: number;
  onFinish: (results: GameResult[]) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ words, duration, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [results, setResults] = useState<GameResult[]>([]);
  const [countdown, setCountdown] = useState(3);
  const [feedback, setFeedback] = useState<TiltAction>(TiltAction.NONE);
  
  const tilt = useOrientation(countdown === 0 && timeLeft > 0);
  const gameEndedRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Audio Context on first interaction/mount
  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  };

  // Sound Synthesizers
  const playBeep = (freq: number, type: OscillatorType = 'sine', duration: number = 0.1) => {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio play failed", e);
    }
  };

  const playStartChime = () => {
    playBeep(440, 'sine', 0.2);
    setTimeout(() => playBeep(880, 'sine', 0.4), 100);
  };

  // Initial Countdown
  useEffect(() => {
    if (countdown > 0) {
      // Play beep for countdown
      playBeep(660);
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Play start chime when game begins
      playStartChime();
    }
  }, [countdown]);

  // Main Game Timer
  useEffect(() => {
    if (countdown === 0 && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            if (!gameEndedRef.current) {
               gameEndedRef.current = true;
               onFinish(results);
            }
            return 0;
          }
          // Warning beeps for last 5 seconds
          if (prev <= 6) {
            playBeep(440, 'square', 0.05);
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown, timeLeft, onFinish, results]);

  // Handle Tilt or Manual Action
  const nextWord = (isCorrect: boolean) => {
    const newResults = [...results, { word: words[currentIndex], correct: isCorrect }];
    setResults(newResults);
    
    // Provide visual feedback
    setFeedback(isCorrect ? TiltAction.CORRECT : TiltAction.PASS);
    setTimeout(() => setFeedback(TiltAction.NONE), 500);

    // Audio feedback
    if (isCorrect) {
      playBeep(1200, 'sine', 0.1);
    } else {
      playBeep(200, 'sawtooth', 0.2);
    }

    // Vibrate if supported
    if (window.navigator.vibrate) {
      window.navigator.vibrate(isCorrect ? [100] : [200, 50]);
    }

    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    if (tilt === TiltAction.CORRECT) nextWord(true);
    if (tilt === TiltAction.PASS) nextWord(false);
  }, [tilt]);

  if (countdown > 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-900 p-8 text-center overflow-hidden">
        <h2 className="text-2xl font-bold mb-4 text-slate-400">Place phone on forehead!</h2>
        <div className="text-9xl font-black text-emerald-400 animate-bounce">
          {countdown}
        </div>
      </div>
    );
  }

  const bgColor = feedback === TiltAction.CORRECT 
    ? 'bg-emerald-500' 
    : feedback === TiltAction.PASS 
    ? 'bg-red-500' 
    : 'bg-indigo-600';

  return (
    <div className={`flex-1 flex flex-col items-center justify-center p-6 transition-colors duration-300 ${bgColor} text-white relative`}>
      {/* Top Info - Centered for Landscape */}
      <div className="absolute top-4 left-0 right-0 px-10 flex justify-between items-center z-10">
        <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <span className="text-xl font-black">{timeLeft}</span>
          <span className="text-[10px] uppercase font-bold ml-1 opacity-60">sec</span>
        </div>
        <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <span className="text-[10px] uppercase font-bold mr-1 opacity-60">Score</span>
          <span className="text-xl font-black">{results.filter(r => r.correct).length}</span>
        </div>
      </div>

      {/* The Word - Centered Large for Landscape View */}
      <div className="text-center w-full px-4 flex items-center justify-center flex-1">
         <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter break-words drop-shadow-2xl leading-none">
           {words[currentIndex]}
         </h1>
      </div>

      {/* Bottom Visual Cues */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-10 opacity-30 text-[10px] font-bold uppercase tracking-widest pointer-events-none">
        <div className="flex items-center gap-2">
           <i className="fas fa-arrow-up"></i> PASS
        </div>
        <div className="flex items-center gap-2">
           CORRECT <i className="fas fa-arrow-down"></i>
        </div>
      </div>

      {/* Manual Controls (For debugging or non-tilt play) - Visible only on hover/touch */}
      <div className="absolute inset-0 flex items-stretch opacity-0 active:opacity-20 transition-opacity">
        <div onClick={() => nextWord(false)} className="flex-1 bg-red-900 cursor-pointer"></div>
        <div onClick={() => nextWord(true)} className="flex-1 bg-emerald-900 cursor-pointer"></div>
      </div>

      {/* Visual Feedback Overlays */}
      {feedback !== TiltAction.NONE && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none bg-black/10">
          <div className="text-7xl sm:text-8xl md:text-9xl font-black uppercase animate-ping">
            {feedback === TiltAction.CORRECT ? 'CORRECT!' : 'PASS'}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
