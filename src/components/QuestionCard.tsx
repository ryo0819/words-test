import React, { useMemo } from 'react';
import type { QuizItem } from '../types/quiz';

interface QuestionCardProps {
  quizItem: QuizItem;
  onAnswer: (answer: string) => void;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  generationName: string;
  showGeneration?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  quizItem, 
  onAnswer, 
  selectedAnswer, 
  isCorrect,
  generationName,
  showGeneration
}) => {
  const options = useMemo(() => {
    return [...quizItem.dummy, quizItem.correct].sort(() => Math.random() - 0.5);
  }, [quizItem]);

  return (
    <div className="question-card">
      <div className="gen-badge">{generationName}</div>
      <h2 className="question-text">
        {quizItem.pokemon}
        {showGeneration && quizItem.generation && (
          <span className="gen-sub">（{quizItem.generation}）</span>
        )}
        が Lv.{quizItem.level} で覚える技は？
      </h2>
      <div className="options-grid">
        {options.map((option) => (
          <button
            key={option}
            className={`option-button ${selectedAnswer === option ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
            onClick={() => onAnswer(option)}
            disabled={selectedAnswer !== null}
          >
            {option}
          </button>
        ))}
      </div>
      {selectedAnswer && (
        <div className={`feedback ${isCorrect ? 'correct-text' : 'incorrect-text'}`}>
          {isCorrect ? '正解！' : `残念... 正解は「${quizItem.correct}」`}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
