import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { ThemeSelector } from './components/ThemeSelector';
import { QuizCard } from './components/QuizCard';
import { ResultView } from './components/ResultView';
import { VocabularyModal } from './components/VocabularyModal';
import { VOCABULARY_LIST, THEMES } from './data/vocabulary';
import { generateQuizSet, generateQuestion } from './utils/quizGenerator';
import type {
  QuizQuestion,
  QuizModeType,
  UserAnswer,
  QuizResultSummary,
} from './types/quiz';
import './index.css';

type AppScreen = 'setup' | 'quiz' | 'result';

export const App: React.FC = () => {
  // Setup State
  const [selectedTheme, setSelectedTheme] = useState<string>('ALL');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [quizMode, setQuizMode] = useState<QuizModeType>('standard');

  // Active Quiz State
  const [screen, setScreen] = useState<AppScreen>('setup');
  const [quizSet, setQuizSet] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [startTime, setStartTime] = useState<number>(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Available items count for selected theme
  const filteredVocabulary = useMemo(() => {
    if (selectedTheme === 'ALL') return VOCABULARY_LIST;
    return VOCABULARY_LIST.filter(item => item.theme === selectedTheme);
  }, [selectedTheme]);

  // Start Quiz Handler
  const handleStartQuiz = () => {
    let questions: QuizQuestion[] = [];
    if (quizMode === 'standard') {
      questions = generateQuizSet(VOCABULARY_LIST, selectedTheme, questionCount);
    } else {
      // Endless mode: start with initial set or pool
      questions = generateQuizSet(VOCABULARY_LIST, selectedTheme, 50);
    }

    setQuizSet(questions);
    setCurrentIndex(0);
    setUserAnswers([]);
    setStartTime(Date.now());
    setScreen('quiz');
  };

  // Answer Selected Handler
  const handleAnswerQuestion = (selectedOption: string) => {
    const currentQuestion = quizSet[currentIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    const answerRecord: UserAnswer = {
      question: currentQuestion,
      selectedAnswer: selectedOption,
      isCorrect,
      timeTakenSec: 0,
    };

    const newAnswers = [...userAnswers, answerRecord];
    setUserAnswers(newAnswers);

    // Check game over in endless mode
    if (quizMode === 'endless' && !isCorrect) {
      setScreen('result');
      return;
    }

    // Check if finished standard mode or need next question
    if (quizMode === 'standard' && currentIndex + 1 >= quizSet.length) {
      setScreen('result');
    } else {
      // In endless mode, append new questions dynamically if pool running low
      if (quizMode === 'endless' && currentIndex + 2 >= quizSet.length) {
        // pick a random target
        const randomTarget = filteredVocabulary[Math.floor(Math.random() * filteredVocabulary.length)];
        const nextQ = generateQuestion(randomTarget, VOCABULARY_LIST);
        setQuizSet(prev => [...prev, nextQ]);
      }
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Compute final summary for result view
  const resultSummary: QuizResultSummary = useMemo(() => {
    const totalQuestions = userAnswers.length;
    const correctCount = userAnswers.filter(a => a.isCorrect).length;
    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const totalTimeSec = startTime > 0 ? Math.max(1, Math.round((Date.now() - startTime) / 1000)) : 0;

    return {
      totalQuestions,
      correctCount,
      scorePercentage,
      answers: userAnswers,
      totalTimeSec,
    };
  }, [userAnswers, startTime]);

  return (
    <div className="app-layout">
      <Header
        onOpenVocabularyModal={() => setIsModalOpen(true)}
        onReturnHome={() => setScreen('setup')}
        totalWordsCount={VOCABULARY_LIST.length}
      />

      <main className="main-content">
        {screen === 'setup' && (
          <ThemeSelector
            themes={THEMES}
            selectedTheme={selectedTheme}
            onSelectTheme={setSelectedTheme}
            questionCount={questionCount}
            onSelectQuestionCount={setQuestionCount}
            mode={quizMode}
            onSelectMode={setQuizMode}
            onStartQuiz={handleStartQuiz}
            totalAvailableCount={filteredVocabulary.length}
          />
        )}

        {screen === 'quiz' && quizSet[currentIndex] && (
          <QuizCard
            question={quizSet[currentIndex]}
            currentIndex={currentIndex}
            totalQuestions={quizSet.length}
            mode={quizMode}
            onAnswer={handleAnswerQuestion}
            onQuit={() => setScreen('setup')}
          />
        )}

        {screen === 'result' && (
          <ResultView
            summary={resultSummary}
            onRetry={handleStartQuiz}
            onHome={() => setScreen('setup')}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>© Medical Vocabulary Quiz | 医療・医学英単語クイズ学習アプリ</p>
      </footer>

      <VocabularyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vocabularyList={VOCABULARY_LIST}
        themes={THEMES}
      />
    </div>
  );
};
