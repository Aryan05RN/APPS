
import React from 'react';
import { GameSession } from '../types';

interface ResultsViewProps {
  session: GameSession;
  onRestart: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ session, onRestart }) => {
  const correctCount = session.history.filter(h => h.correct).length;
  const totalAttempts = session.history.length;
  const accuracy = totalAttempts > 0 
    ? Math.round((correctCount / totalAttempts) * 100) 
    : 0;

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-white overflow-hidden h-full">
      {/* Header Summary - Increased z-index and forced opaque background */}
      <div className={`${session.category.color} p-6 sm:p-10 text-center rounded-b-[3rem] shadow-2xl relative z-30 flex-shrink-0`}>
        {/* Floating icon for flair */}
        <div className="absolute top-4 right-6 opacity-20">
           <i className={`fas ${session.category.icon} text-6xl`}></i>
        </div>
        
        <h2 className="text-lg font-bold uppercase tracking-widest opacity-80 mb-1">Final Results</h2>
        
        {/* Main Score Display: Correct / Total */}
        <div className="flex items-baseline justify-center gap-2 mb-1 drop-shadow-xl animate-in zoom-in duration-500">
          <span className="text-7xl sm:text-8xl md:text-9xl font-black leading-none">{correctCount}</span>
          <span className="text-2xl sm:text-4xl font-bold opacity-60">/ {totalAttempts}</span>
        </div>
        
        <p className="text-base font-bold opacity-90 mb-4">Total Score</p>
        
        <div className="flex justify-center gap-8 sm:gap-12">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-black">{totalAttempts}</div>
            <div className="text-[10px] uppercase font-bold opacity-70 tracking-tighter whitespace-nowrap">Total Attempt</div>
          </div>
          <div className="w-[1px] h-8 bg-white/20 my-auto"></div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-black">{session.duration}s</div>
            <div className="text-[10px] uppercase font-bold opacity-70 tracking-tighter">Duration</div>
          </div>
          <div className="w-[1px] h-8 bg-white/20 my-auto"></div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-black">{accuracy}%</div>
            <div className="text-[10px] uppercase font-bold opacity-70 tracking-tighter">Accuracy</div>
          </div>
        </div>
      </div>

      {/* List of Results - Scrollable Area (Removed padding from here to fix sticky behavior) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900 min-h-0 z-10 relative">
        {/* Sticky label stays at the absolute top of this container */}
        <div className="sticky top-0 bg-slate-900 px-6 py-4 z-20 flex justify-between items-center shadow-md">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Word History</h3>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-bold uppercase">
            Performance
          </span>
        </div>

        {/* List content with padding applied here instead of the parent */}
        <div className="px-6 pb-8 space-y-3">
          {session.history.map((item, idx) => (
            <div 
              key={idx} 
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                item.correct 
                ? 'bg-emerald-500/5 border-emerald-500/20 shadow-sm' 
                : 'bg-slate-800/40 border-slate-700/50 grayscale opacity-80'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${item.correct ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`}></div>
                <span className={`font-bold text-lg ${item.correct ? 'text-white' : 'text-slate-500'}`}>
                  {item.word}
                </span>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                item.correct 
                ? 'bg-emerald-500/20 text-emerald-500' 
                : 'bg-red-500/10 text-red-500/50'
              }`}>
                <i className={`fas ${item.correct ? 'fa-check' : 'fa-xmark'} text-sm`}></i>
              </div>
            </div>
          ))}
          
          {session.history.length === 0 && (
             <div className="text-center py-12">
               <i className="fas fa-ghost text-4xl text-slate-800 mb-4 block"></i>
               <p className="text-slate-500 font-bold italic">No words were played.</p>
             </div>
          )}
        </div>
      </div>

      {/* Footer Actions - Fixed bottom */}
      <div className="p-6 bg-slate-900 border-t border-slate-800 shadow-[0_-10px_20px_rgba(0,0,0,0.3)] flex-shrink-0 z-30">
        <button 
          onClick={onRestart}
          className="w-full py-4 sm:py-5 bg-emerald-500 hover:bg-emerald-600 rounded-2xl text-xl font-black transition-all transform active:scale-95 shadow-[0_6px_0_rgb(5,150,105)] mb-2"
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
};

export default ResultsView;
