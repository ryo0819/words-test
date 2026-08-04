import React from 'react';
import type { QuizModeType } from '../types/quiz';

interface ThemeSelectorProps {
  themes: string[];
  selectedTheme: string;
  onSelectTheme: (theme: string) => void;
  questionCount: number;
  onSelectQuestionCount: (count: number) => void;
  mode: QuizModeType;
  onSelectMode: (mode: QuizModeType) => void;
  onStartQuiz: () => void;
  totalAvailableCount: number;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes,
  selectedTheme,
  onSelectTheme,
  questionCount,
  onSelectQuestionCount,
  mode,
  onSelectMode,
  onStartQuiz,
  totalAvailableCount,
}) => {
  return (
    <div className="card theme-selector-card glass-panel fade-in">
      <div className="selector-header">
        <h2>クイズの出題設定</h2>
        <p>医学英単語リスト（全707語）からランダム出題されます</p>
      </div>

      <div className="setting-section">
        <label className="setting-label">1. テーマ（カテゴリ）を選択</label>
        <div className="theme-grid">
          <button
            className={`theme-chip ${selectedTheme === 'ALL' ? 'active' : ''}`}
            onClick={() => onSelectTheme('ALL')}
          >
            <span className="chip-icon">🌐</span>
            <span className="chip-label">全テーマミックス</span>
          </button>

          {themes.map(theme => (
            <button
              key={theme}
              className={`theme-chip ${selectedTheme === theme ? 'active' : ''}`}
              onClick={() => onSelectTheme(theme)}
            >
              <span className="chip-label">{theme}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="setting-row">
        <div className="setting-section half">
          <label className="setting-label">2. モード選択</label>
          <div className="button-group">
            <button
              className={`mode-btn ${mode === 'standard' ? 'active' : ''}`}
              onClick={() => onSelectMode('standard')}
            >
              🎯 標準モード (規定問題数)
            </button>
            <button
              className={`mode-btn ${mode === 'endless' ? 'active' : ''}`}
              onClick={() => onSelectMode('endless')}
            >
              🔥 エンドレス (1誤答で即終了)
            </button>
          </div>
        </div>

        {mode === 'standard' && (
          <div className="setting-section half">
            <label className="setting-label">3. 出題数</label>
            <div className="button-group">
              {[5, 10, 20, 30].map(count => (
                <button
                  key={count}
                  className={`count-btn ${questionCount === count ? 'active' : ''}`}
                  onClick={() => onSelectQuestionCount(count)}
                >
                  {count}問
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="start-container">
        <div className="target-count-info">
          出題対象の単語数: <strong>{totalAvailableCount}</strong> 語
        </div>
        <button className="btn-primary start-btn" onClick={onStartQuiz}>
          クイズを開始する 🚀
        </button>
      </div>
    </div>
  );
};
