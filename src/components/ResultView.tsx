import React from 'react';
import type { QuizResultSummary } from '../types/quiz';

interface ResultViewProps {
  summary: QuizResultSummary;
  onRetry: () => void;
  onHome: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ summary, onRetry, onHome }) => {
  const getRankBadge = (scorePercentage: number) => {
    if (scorePercentage === 100) return { title: '🏆 PERFECT!', color: '#ffd700', desc: '完璧です！医学単語マスター！' };
    if (scorePercentage >= 80) return { title: '🥇 EXCELLENT', color: '#10b981', desc: '素晴らしい医療知識です！' };
    if (scorePercentage >= 60) return { title: '🥈 GOOD JOB', color: '#3b82f6', desc: '合格ラインクリア！復習してさらに伸ばしましょう。' };
    return { title: '📘 KEEP TRYING', color: '#f59e0b', desc: '間違えた単語を中心にチェックしてみましょう！' };
  };

  const rank = getRankBadge(summary.scorePercentage);

  return (
    <div className="card result-card glass-panel fade-in">
      <div className="result-header">
        <span className="rank-badge" style={{ backgroundColor: rank.color }}>
          {rank.title}
        </span>
        <h2>クイズ結果発表</h2>
        <p className="rank-desc">{rank.desc}</p>
      </div>

      <div className="score-summary-grid">
        <div className="score-box">
          <div className="score-number">{summary.scorePercentage}%</div>
          <div className="score-label">正答率</div>
        </div>
        <div className="score-box">
          <div className="score-number">
            {summary.correctCount} / {summary.totalQuestions}
          </div>
          <div className="score-label">正解数</div>
        </div>
        <div className="score-box">
          <div className="score-number">{summary.totalTimeSec}秒</div>
          <div className="score-label">解答時間</div>
        </div>
      </div>

      <div className="result-actions">
        <button className="btn-primary retry-btn" onClick={onRetry}>
          🔄 もう一度挑戦する
        </button>
        <button className="btn-secondary home-btn" onClick={onHome}>
          🏠 トップへ戻る
        </button>
      </div>

      {/* Review Section */}
      <div className="review-section">
        <h3>📝 出題結果・復習リスト</h3>
        <div className="review-list">
          {summary.answers.map((item, idx) => (
            <div
              key={idx}
              className={`review-item ${item.isCorrect ? 'is-correct' : 'is-wrong'}`}
            >
              <div className="review-status">
                {item.isCorrect ? '⭕' : '❌'}
              </div>
              <div className="review-content">
                <div className="review-word-row">
                  <span className="review-word">{item.question.wordItem.word}</span>
                  <span className="review-theme">{item.question.wordItem.theme}</span>
                </div>
                <div className="review-meaning-row">
                  <span className="review-label">正解の意味:</span>
                  <span className="review-answer correct">
                    {item.question.correctAnswer}
                  </span>
                </div>
                {!item.isCorrect && (
                  <div className="review-meaning-row">
                    <span className="review-label">あなたの回答:</span>
                    <span className="review-answer selected-wrong">
                      {item.selectedAnswer}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
