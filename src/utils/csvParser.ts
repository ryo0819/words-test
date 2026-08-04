import type { VocabularyItem } from '../types/quiz';

/**
 * Parse CSV line handling quotes properly
 */
export function parseCSVRow(rowText: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < rowText.length; i++) {
    const char = rowText[i];
    if (char === '"') {
      if (inQuotes && rowText[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function parseMedicalCSV(csvText: string): VocabularyItem[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length <= 1) return [];

  const items: VocabularyItem[] = [];
  let idCounter = 1;

  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVRow(lines[i]);
    if (cols.length >= 5) {
      const sectionId = parseInt(cols[0], 10) || 0;
      const theme = cols[1];
      const number = parseInt(cols[2], 10) || 0;
      const word = cols[3];
      const meaning = cols[4];

      if (word && meaning) {
        items.push({
          id: idCounter++,
          sectionId,
          theme,
          number,
          word,
          meaning,
        });
      }
    }
  }

  return items;
}
