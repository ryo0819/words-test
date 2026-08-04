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
