
export enum GameView {
  SPLASH = 'SPLASH',
  HOME = 'HOME',
  CATEGORY_SELECT = 'CATEGORY_SELECT',
  PRE_GAME = 'PRE_GAME',
  PLAYING = 'PLAYING',
  RESULTS = 'RESULTS'
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface GameResult {
  word: string;
  correct: boolean;
}

export interface GameSession {
  category: Category;
  duration: number;
  score: number;
  totalQuestions: number;
  history: GameResult[];
}
