import React, { useState, useEffect } from 'react';
import type { QuizQuestion, QuizModeType } from '../types/quiz';

interface QuizCardProps {
  question: QuizQuestion;
  currentIndex: number;
  totalQuestions: number;
  mode: QuizModeType;
  onAnswer: (selectedOption: string) => void;
  onQuit: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  mode,
  onAnswer,
  onQuit,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  useEffect(() => {
    // Reset state on new question
    setSelectedOption(null);
    setIsAnswered(false);
  }, [question]);

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (selectedOption) {
      onAnswer(selectedOption);
    }
  };

  const isCorrect = selectedOption === question.correctAnswer;
  const isLastQuestion = mode === 'standard' && currentIndex + 1 === totalQuestions;
  const isEndlessGameOver = mode === 'endless' && isAnswered && !isCorrect;

  const progressPercent = mode === 'endless'
    ? 100
    : Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="card quiz-card glass-panel fade-in">
      {/* Quiz Progress & Status */}
      <div className="quiz-header-bar">
        <div className="quiz-progress-info">
          {mode === 'standard' ? (
            <span className="question-counter">
              第 <strong>{currentIndex + 1}</strong> 問 / 全 {totalQuestions} 問
            </span>
          ) : (
            <span className="question-counter endless-tag">
              🔥 エンドレスモード (現在 {currentIndex + 1} 問目)
            </span>
          )}
          <span className="theme-badge">{question.wordItem.theme}</span>
        </div>
        <button className="quit-btn" onClick={onQuit} title="中断してメインに戻る">
          ✕ 中断
        </button>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Word Question Container */}
      <div className="word-display-area">
        <div className="word-label">英単語</div>
        <h2 className="word-text">{question.wordItem.word}</h2>
        <div className="word-meta">
          Section {question.wordItem.sectionId} - No.{question.wordItem.number}
        </div>
      </div>

      {/* 4 Options Grid */}
      <div className="options-grid">
        {question.options.map((option, index) => {
          let btnStateClass = '';
          if (isAnswered) {
            if (option === question.correctAnswer) {
              btnStateClass = 'correct-option';
            } else if (option === selectedOption) {
              btnStateClass = 'wrong-option';
            } else {
              btnStateClass = 'dimmed-option';
            }
          }

          const optionLabels = ['A', 'B', 'C', 'D'];

          return (
            <button
              key={`${question.id}-${index}`}
              className={`option-btn ${btnStateClass}`}
              onClick={() => handleSelectOption(option)}
              disabled={isAnswered}
            >
              <span className="option-prefix">{optionLabels[index]}</span>
              <span className="option-text">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Visual Result Hint & Next Button */}
      {isAnswered && (
        <div className="answer-section-footer fade-in">
          <div className={`answer-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
            {isCorrect ? (
              <span>⭕ 正解！</span>
            ) : (
              <span>❌ 不正解... 正解: 「{question.correctAnswer}」</span>
            )}
          </div>

          <button className="btn-primary next-question-btn" onClick={handleNext}>
            {isLastQuestion || isEndlessGameOver
              ? '結果画面へ 📊'
              : '次の問題へ ➔'}
          </button>
        </div>
      )}
    </div>
  );
};
