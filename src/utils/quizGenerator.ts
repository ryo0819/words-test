import type { VocabularyItem, QuizQuestion } from '../types/quiz';

/**
 * Array shuffle helper (Fisher-Yates)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate a single quiz question with 1 correct meaning and 3 dummy meanings
 */
export function generateQuestion(
  targetItem: VocabularyItem,
  allVocabulary: VocabularyItem[]
): QuizQuestion {
  const correctAnswer = targetItem.meaning;

  // Filter out items that have the exact same meaning or word as target
  const candidateDummies = allVocabulary
    .filter(item => item.meaning !== correctAnswer && item.word !== targetItem.word)
    .map(item => item.meaning);

  // Deduplicate dummy meanings
  const uniqueDummyMeanings = Array.from(new Set(candidateDummies));

  // Randomly pick 3 dummy options
  const shuffledDummies = shuffleArray(uniqueDummyMeanings).slice(0, 3);

  // Combine correct answer and 3 dummy options
  const options = shuffleArray([correctAnswer, ...shuffledDummies]);

  return {
    id: targetItem.id,
    wordItem: targetItem,
    options,
    correctAnswer,
  };
}

/**
 * Generate a set of quiz questions based on selected theme and question count
 */
export function generateQuizSet(
  allVocabulary: VocabularyItem[],
  selectedTheme: string | 'ALL',
  count: number = 10
): QuizQuestion[] {
  let targetPool = allVocabulary;

  if (selectedTheme !== 'ALL') {
    targetPool = allVocabulary.filter(item => item.theme === selectedTheme);
  }

  // Shuffle target items
  const shuffledTargetPool = shuffleArray(targetPool);
  const selectedItems = shuffledTargetPool.slice(0, Math.min(count, shuffledTargetPool.length));

  return selectedItems.map(item => generateQuestion(item, allVocabulary));
}
