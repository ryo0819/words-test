import React from 'react';

interface HeaderProps {
  onOpenVocabularyModal: () => void;
  onReturnHome: () => void;
  totalWordsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenVocabularyModal,
  onReturnHome,
  totalWordsCount,
}) => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand" onClick={onReturnHome} style={{ cursor: 'pointer' }}>
          <div className="brand-icon">🩺</div>
          <div className="brand-text">
            <h1>Medical Vocab Quiz</h1>
            <span className="brand-subtitle">医学・生物医療英単語 4択クイズ</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-secondary vocab-btn" onClick={onOpenVocabularyModal}>
            📚 単語一覧 ({totalWordsCount})
          </button>
        </div>
      </div>
    </header>
  );
};
