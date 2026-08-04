import type { VocabularyItem } from '../types/quiz';
import { parseMedicalCSV } from '../utils/csvParser';
import { MEDICAL_CSV_STRING } from './csvString';

let parsedList: VocabularyItem[] = [];

try {
  parsedList = parseMedicalCSV(MEDICAL_CSV_STRING);
} catch (e) {
  console.error('Failed to parse CSV string:', e);
}

export const VOCABULARY_LIST: VocabularyItem[] = parsedList;

export const THEMES: string[] = Array.from(
  new Set(VOCABULARY_LIST.map(item => item.theme))
);

export const SECTION_MAP: Record<string, number> = VOCABULARY_LIST.reduce((acc, item) => {
  if (item && item.theme) {
    if (!acc[item.theme]) {
      acc[item.theme] = item.sectionId;
    }
  }
  return acc;
}, {} as Record<string, number>);
