
import React from 'react';

interface HomeViewProps {
  onStart: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onStart }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 to-indigo-900 text-white overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
      
      <div className="z-10 text-center">
        <div className="mb-6 inline-block bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl">
          <i className="fas fa-bolt text-6xl text-yellow-400 mb-2 animate-pulse"></i>
          <h1 className="text-5xl font-black tracking-tighter">
            GUESS<span className="text-emerald-400"> IT</span>
          </h1>
          <p className="text-slate-300 font-medium tracking-wide">GUESS FAST. WIN BIG.</p>
        </div>

        <div className="space-y-4 max-w-xs mx-auto">
          <button 
            onClick={onStart}
            className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 rounded-2xl text-2xl font-black transition-all transform active:scale-95 shadow-[0_8px_0_rgb(5,150,105)] mb-4"
          >
            START GAME
          </button>
          
          <div className="flex items-center justify-center space-x-4 text-slate-400">
            <div className="flex flex-col items-center">
              <i className="fas fa-mobile-screen-button text-xl mb-1"></i>
              <span className="text-[10px] uppercase font-bold">Forehead</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-700"></div>
            <div className="flex flex-col items-center">
              <i className="fas fa-rotate text-xl mb-1"></i>
              <span className="text-[10px] uppercase font-bold">Tilt to Play</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-700"></div>
            <div className="flex flex-col items-center">
              <i className="fas fa-users text-xl mb-1"></i>
              <span className="text-[10px] uppercase font-bold">Party Fun</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;