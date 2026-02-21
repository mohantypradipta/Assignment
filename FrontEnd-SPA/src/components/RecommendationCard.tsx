import React from 'react';
import '../styles/RecommendationCard.scss';

interface RecommendationCardProps {
  recommendation: 'Chat' | 'Nurse' | 'Doctor';
  score: number;
}

const recommendationDescriptions = {
  Chat: {
    title: 'Self-Care via Chat',
    description:
      'Your symptoms suggest that self-care guidance from our health advisors may be sufficient. Our chat service can provide tips and monitor your condition.',
  },
  Nurse: {
    title: 'Nurse Consultation',
    description:
      'A qualified nurse can assess your condition and provide personalized advice. They can also refer you to a doctor if needed.',
  },
  Doctor: {
    title: 'Doctor Appointment',
    description:
      'Your symptoms require a doctor\'s evaluation. Please book an appointment to discuss your condition and receive a diagnosis.',
  },
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  score,
}) => {
  const details = recommendationDescriptions[recommendation];

  return (
    <div className={`recommendation-card recommendation-${recommendation.toLowerCase()}`}>
      <div className="recommendation-header">
        <h2 className="recommendation-title">{details.title}</h2>
        <div className="score-badge">Score: {score}/15</div>
      </div>
      <p className="recommendation-description">{details.description}</p>
    </div>
  );
};
