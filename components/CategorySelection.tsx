
import React from 'react';
import { Category } from '../types';
import { MIN_GAME_TIME, MAX_GAME_TIME } from '../constants';

interface CategorySelectionProps {
  categories: Category[];
  onSelect: (category: Category) => void;
  onBack: () => void;
  isLoading: boolean;
  gameTime: number;
  setGameTime: (time: number) => void;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({ 
  categories, 
  onSelect, 
  onBack, 
  isLoading,
  gameTime,
  setGameTime
}) => {
  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-white overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-slate-800 border-b border-slate-700">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-700 transition-colors">
          <i className="fas fa-arrow-left"></i>
        </button>
        <h2 className="text-xl font-bold">Select Category</h2>
        <div className="w-10"></div>
      </div>

      {/* Settings Section */}
      <div className="p-6 bg-slate-800/50">
        <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Game Duration</label>
        <div className="flex items-center justify-between space-x-4">
          <button 
            onClick={() => setGameTime(Math.max(MIN_GAME_TIME, gameTime - 10))}
            className="w-12 h-12 flex items-center justify-center bg-slate-700 rounded-xl hover:bg-slate-600 active:scale-95 transition-all"
          >
            <i className="fas fa-minus"></i>
          </button>
          <div className="flex-1 text-center">
            <span className="text-4xl font-black text-emerald-400">{gameTime}</span>
            <span className="ml-2 text-slate-400 font-bold">SEC</span>
          </div>
          <button 
            onClick={() => setGameTime(Math.min(MAX_GAME_TIME, gameTime + 10))}
            className="w-12 h-12 flex items-center justify-center bg-slate-700 rounded-xl hover:bg-slate-600 active:scale-95 transition-all"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
        <input 
          type="range" 
          min={MIN_GAME_TIME} 
          max={MAX_GAME_TIME} 
          step={10} 
          value={gameTime} 
          onChange={(e) => setGameTime(parseInt(e.target.value))}
          className="w-full mt-6 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
      </div>

      {/* Categories Grid */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-emerald-400 font-bold animate-pulse">Generating Words with AI...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelect(cat)}
                className={`${cat.color} p-6 rounded-2xl flex flex-col items-center justify-center space-y-3 transition-all transform active:scale-95 shadow-lg group`}
              >
                <div className="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className={`fas ${cat.icon} text-2xl text-white`}></i>
                </div>
                <span className="font-bold text-sm tracking-tight">{cat.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySelection;
