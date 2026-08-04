import React from 'react';
import type { GameStatus, Generation, QuizItem } from '../types/quiz';

interface QuizContainerProps {
  status?: GameStatus;
  generation?: Generation;
  question?: QuizItem;
}

export const QuizContainer: React.FC<QuizContainerProps> = ({ status }) => {
  return <div>{status}</div>;
};
