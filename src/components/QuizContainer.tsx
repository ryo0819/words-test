import React, { useState } from 'react';
import type { GameStatus, Generation, QuizItem } from '../types/quiz';
import { generateQuiz } from '../data/questions';
import QuestionCard from './QuestionCard';
import ResultView from './ResultView';
import ProgressBar from './ProgressBar';

interface QuizContainerProps {
  onRestart?: () => void;
}

const QuizContainer: React.FC<QuizContainerProps> = ({ onRestart }) => {
  const [status, setStatus] = useState<GameStatus>('START');
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [isEndless, setIsEndless] = useState(false);
  const [shuffledQuiz, setShuffledQuiz] = useState<QuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentQuiz = shuffledQuiz[currentIndex];

  const handleStart = (gen: Generation, endless: boolean = false) => {
    const questions = generateQuiz(gen, endless ? 0 : 10);
    setShuffledQuiz(questions);
    setGeneration(gen);
    setIsEndless(endless);
    setStatus('QUIZ');
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handleRestart = () => {
    setGeneration(null);
    setIsEndless(false);
    setStatus('START');
    if (onRestart) onRestart();
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === currentQuiz.correct;
    setIsCorrect(correct);
    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    // エンドレスモードで不正解だった場合は終了
    const isGameOver = isEndless && isCorrect === false;

    if (!isGameOver && currentIndex + 1 < shuffledQuiz.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setStatus('RESULT');
    }
  };

  const getGenName = (gen: Generation) => {
    switch (gen) {
      case 'rb': return '赤・緑';
      case 'gs': return '金・銀';
      case 'rs': return 'ルビー・サファイア';
      case 'dp': return 'ダイヤモンド・パール';
      case 'all': return '全世代ランダム';
    }
  };

  return (
    <div className="quiz-container">
      {status === 'START' && (
        <div className="start-screen fade-in">
          <h2>モードを選択してください</h2>
          <div className="gen-selector">
            {(['rb', 'gs', 'rs', 'dp'] as Generation[]).map(gen => (
              <button
                key={gen}
                className={`gen-button ${generation === gen && !isEndless ? 'active' : ''}`}
                onClick={() => {
                  setGeneration(gen);
                  setIsEndless(false);
                }}
              >
                {getGenName(gen)}
              </button>
            ))}
          </div>

          <div className="mode-divider">OR</div>

          <button
            className={`endless-button ${isEndless ? 'active' : ''}`}
            onClick={() => {
              setGeneration('all');
              setIsEndless(true);
            }}
          >
            エンドレスモード (全世代)
          </button>

          <button
            className="start-button"
            onClick={() => generation && handleStart(generation, isEndless)}
            disabled={!generation}
          >
            はじめる
          </button>
        </div>
      )}

      {status === 'QUIZ' && currentQuiz && generation && (
        <div className="quiz-content fade-in">
          <div className="quiz-header">
            <div className="gen-display">
              {isEndless ? '🔥 エンドレス' : `世代: ${getGenName(generation)}`}
            </div>
            <button className="back-to-top-small" onClick={handleRestart}>
              終了する
            </button>
          </div>

          {isEndless ? (
            <div className="endless-stats">
              <span className="stat-item">現在の問題: <strong>第 {currentIndex + 1} 問 / 全 {shuffledQuiz.length} 問</strong></span>
            </div>
          ) : (
            <>
              <ProgressBar current={currentIndex + 1} total={shuffledQuiz.length} />
              <div className="progress-text">
                Question {currentIndex + 1} / {shuffledQuiz.length}
              </div>
            </>
          )}

          <QuestionCard
            quizItem={currentQuiz}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            isCorrect={isCorrect}
            generationName={getGenName(generation)}
            showGeneration={isEndless}
          />
          {selectedAnswer && (
            <button className="next-button fade-in" onClick={handleNext}>
              {currentIndex + 1 === shuffledQuiz.length || (isEndless && isCorrect === false) ? '結果を見る' : '次の問題へ'}
            </button>
          )}
        </div>
      )}

      {status === 'RESULT' && (
        <div className="fade-in">
          <ResultView
            score={score}
            total={isEndless ? currentIndex + 1 : shuffledQuiz.length}
            onRestart={handleRestart}
          />
        </div>
      )}
    </div>
  );
};

export default QuizContainer;
