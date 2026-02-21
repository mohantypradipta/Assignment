import React from 'react';
import '../styles/QuestionCard.scss';

interface QuestionCardProps {
  question: number;
  title: string;
  options: { label: string; score: number }[];
  selectedScore: number | undefined;
  onSelect: (score: number) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  title,
  options,
  selectedScore,
  onSelect,
}) => {
  return (
    <div className="question-card">
      <div className="progress-indicator">
        <span className="progress-text">Question {question} of 5</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(question / 5) * 100}%` }}></div>
        </div>
      </div>

      <h2 className="question-title">{title}</h2>

      <div className="options-container">
        {options.map((option) => (
          <button
            key={option.score}
            className={`option-button ${selectedScore === option.score ? 'selected' : ''}`}
            onClick={() => onSelect(option.score)}
            aria-pressed={selectedScore === option.score}
          >
            <span className="option-label">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
