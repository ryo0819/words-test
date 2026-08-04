import React from 'react';
import type { QuizItem } from '../types/quiz';

interface QuestionCardProps {
  question: QuizItem;
  currentNumber: number;
  totalQuestions: number;
  onAnswer: (selected: string) => void;
  disabled?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = () => {
  return null;
};
