
import React, { useState, useEffect, useCallback } from 'react';
import { GameView, Category, GameSession, GameResult } from './types';
import { CATEGORIES, DEFAULT_GAME_TIME } from './constants';
import CategorySelection from './components/CategorySelection';
import GameScreen from './components/GameScreen';
import ResultsView from './components/ResultsView';
import HomeView from './components/HomeView';
import SplashView from './components/SplashView';
import { generateWordList } from './services/geminiService';
import { requestOrientationPermission, lockToLandscape, unlockOrientation } from './hooks/useOrientation';

const App: React.FC = () => {
  const [view, setView] = useState<GameView>(GameView.SPLASH);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [gameTime, setGameTime] = useState(DEFAULT_GAME_TIME);
  const [words, setWords] = useState<string[]>([]);
  const [session, setSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  // Splash screen effect
  useEffect(() => {
    if (view === GameView.SPLASH) {
      const timer = setTimeout(() => {
        setView(GameView.HOME);
      }, 3000); // Show splash for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [view]);

  const startCategorySelection = () => setView(GameView.CATEGORY_SELECT);

  const selectCategory = async (category: Category) => {
    setSelectedCategory(category);
    setIsLoading(true);
    try {
      const granted = await requestOrientationPermission();
      setHasPermission(granted);
      
      const generatedWords = await generateWordList(category.name);
      setWords(generatedWords);
      setView(GameView.PRE_GAME);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const startGame = async () => {
    if (!selectedCategory) return;
    
    // Attempt to lock to landscape and enter fullscreen
    await lockToLandscape();

    setSession({
      category: selectedCategory,
      duration: gameTime,
      score: 0,
      totalQuestions: 0,
      history: []
    });
    setView(GameView.PLAYING);
  };

  const finishGame = async (results: GameResult[]) => {
    if (!session) return;
    
    // Unlock orientation and exit fullscreen
    await unlockOrientation();

    const finalScore = results.filter(r => r.correct).length;
    setSession({
      ...session,
      score: finalScore,
      totalQuestions: results.length,
      history: results
    });
    setView(GameView.RESULTS);
  };

  const restart = () => {
    setView(GameView.CATEGORY_SELECT);
    setSelectedCategory(null);
    setSession(null);
  };

  return (
    <div className="h-screen w-full flex flex-col font-sans select-none bg-slate-900 overflow-hidden">
      {view === GameView.SPLASH && <SplashView />}

      {view === GameView.HOME && (
        <HomeView onStart={startCategorySelection} />
      )}

      {view === GameView.CATEGORY_SELECT && (
        <CategorySelection 
          categories={CATEGORIES} 
          onSelect={selectCategory} 
          onBack={() => setView(GameView.HOME)}
          isLoading={isLoading}
          gameTime={gameTime}
          setGameTime={setGameTime}
        />
      )}

      {view === GameView.PRE_GAME && selectedCategory && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-900 text-center overflow-y-auto">
          <div className={`w-24 h-24 rounded-full ${selectedCategory.color} flex items-center justify-center mb-6 shadow-lg flex-shrink-0`}>
             <i className={`fas ${selectedCategory.icon} text-4xl`}></i>
          </div>
          <h2 className="text-3xl font-bold mb-4">Ready for {selectedCategory.name}?</h2>
          <p className="text-slate-400 mb-8 max-w-xs text-sm">
            When you click start, the phone will switch to <span className="text-emerald-400 font-bold">Landscape</span>. 
            Hold it against your forehead!
          </p>
          <button 
            onClick={startGame}
            className="w-full max-w-xs py-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl text-xl font-bold transition-all transform active:scale-95 shadow-xl flex-shrink-0"
          >
            I'M READY!
          </button>
          {!hasPermission && (
             <p className="mt-4 text-xs text-red-400">Warning: Motion sensors might be disabled. Tilt gestures may not work.</p>
          )}
        </div>
      )}

      {view === GameView.PLAYING && session && (
        <GameScreen 
          words={words} 
          duration={session.duration} 
          onFinish={finishGame} 
        />
      )}

      {view === GameView.RESULTS && session && (
        <ResultsView 
          session={session} 
          onRestart={restart} 
        />
      )}
    </div>
  );
};

export default App;
