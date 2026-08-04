import React, { useState, useMemo } from 'react';
import type { VocabularyItem } from '../types/quiz';

interface VocabularyModalProps {
  isOpen: boolean;
  onClose: () => void;
  vocabularyList: VocabularyItem[];
  themes: string[];
}

export const VocabularyModal: React.FC<VocabularyModalProps> = ({
  isOpen,
  onClose,
  vocabularyList,
  themes,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('ALL');

  const filteredItems = useMemo(() => {
    return vocabularyList.filter(item => {
      const matchesTheme = selectedTheme === 'ALL' || item.theme === selectedTheme;
      const matchesSearch =
        item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.meaning.includes(searchTerm);
      return matchesTheme && matchesSearch;
    });
  }, [vocabularyList, selectedTheme, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop fade-in">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h2>📚 医学英単語帳 (全 {vocabularyList.length} 語)</h2>
          <button className="close-modal-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-filters">
          <input
            type="text"
            className="search-input"
            placeholder="英単語または日本語の意味で検索..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

          <select
            className="theme-select"
            value={selectedTheme}
            onChange={e => setSelectedTheme(e.target.value)}
          >
            <option value="ALL">すべてのテーマ ({vocabularyList.length})</option>
            {themes.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-results-count">
          検索結果: <strong>{filteredItems.length}</strong> 件
        </div>

        <div className="modal-body">
          <div className="vocab-table-container">
            <table className="vocab-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>テーマ</th>
                  <th>英単語</th>
                  <th>意味</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id}>
                    <td className="col-num">{item.id}</td>
                    <td className="col-theme">
                      <span className="table-theme-chip">{item.theme}</span>
                    </td>
                    <td className="col-word">{item.word}</td>
                    <td className="col-meaning">{item.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
