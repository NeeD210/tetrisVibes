export type GameMode = 'endless' | 'sprint' | 'dig' | 'zen' | 'survival';

export type Theme = 'dark' | 'light' | 'retro';

export interface Settings {
  theme: Theme;
  autoRepeatDelay: number; // DAS in ms
  autoRepeatRate: number;  // ARR in ms
} 