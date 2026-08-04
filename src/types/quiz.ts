export interface VocabularyItem {
  id: number;
  sectionId: number;
  theme: string;
  number: number;
  word: string;
  meaning: string;
}

export interface QuizQuestion {
  id: number;
  wordItem: VocabularyItem;
  options: string[]; // 4つの選択肢（意味）
  correctAnswer: string; // 正解の意味
}

export type QuizModeType = 'standard' | 'endless'; // 全10問 または エンドレス

export interface UserAnswer {
  question: QuizQuestion;
  selectedAnswer: string;
  isCorrect: boolean;
  timeTakenSec: number;
}

export interface QuizResultSummary {
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  answers: UserAnswer[];
  totalTimeSec: number;
}

// Legacy Compatibility Types (for clean build compatibility)
export interface PokemonData {
  id: number;
  name: string;
  moves: {
    move_name: string;
    level: number;
  }[];
}

export interface QuizItem {
  id: number;
  pokemon: string;
  level: number;
  correct: string;
  dummy: string[];
}

export type GameStatus = 'START' | 'QUIZ' | 'RESULT';
export type Generation = '1' | '2' | '3' | '4' | 'ENDLESS';
