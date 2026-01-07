
import { Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'food', name: 'Food & Drink', icon: 'fa-utensils', color: 'bg-orange-500' },
  { id: 'animals', name: 'Animals', icon: 'fa-paw', color: 'bg-green-500' },
  { id: 'countries', name: 'Countries', icon: 'fa-globe-americas', color: 'bg-blue-500' },
  { id: 'music', name: 'Music Artists', icon: 'fa-music', color: 'bg-purple-500' },
  { id: 'movies', name: 'Movies', icon: 'fa-film', color: 'bg-red-500' },
  { id: 'tech', name: 'Technology', icon: 'fa-microchip', color: 'bg-cyan-500' },
  { id: 'sports', name: 'Sports', icon: 'fa-volleyball-ball', color: 'bg-yellow-500' },
  { id: 'objects', name: 'Household Objects', icon: 'fa-couch', color: 'bg-indigo-500' },
];

export const DEFAULT_GAME_TIME = 60;
export const MIN_GAME_TIME = 10;
export const MAX_GAME_TIME = 60;
