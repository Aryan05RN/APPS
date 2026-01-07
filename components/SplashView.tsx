
import React, { useEffect, useState } from 'react';

const SplashView: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
      
      <div className={`z-10 flex flex-col items-center transition-all duration-1000 transform ${visible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
        {/* Logo Container */}
        <div className="relative mb-8">
           <div className="absolute inset-0 bg-yellow-400/20 blur-2xl rounded-full animate-pulse"></div>
           <div className="relative bg-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl border border-white/20 shadow-[0_0_50px_rgba(250,204,21,0.2)]">
             <i className="fas fa-bolt text-7xl text-yellow-400 animate-bounce"></i>
           </div>
        </div>

        {/* App Name */}
        <h1 className="text-5xl font-black tracking-tighter mb-2">
          GUESS<span className="text-emerald-400"> IT</span>
        </h1>
        
        {/* Subtitle / Loading Indicator */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-slate-400 font-bold tracking-widest text-xs uppercase opacity-60">
            Guess Fast. Win Big.
          </p>
          
          <div className="mt-8 w-48 h-1 bg-slate-800 rounded-full overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-emerald-500 animate-[shimmer_1.5s_infinite] w-24 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default SplashView;