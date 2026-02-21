import React from 'react';
import '../styles/ConfirmationCard.scss';

interface ConfirmationCardProps {
  confirmationId: string;
  slot: string;
  recommendation: 'Chat' | 'Nurse' | 'Doctor';
  onBackToHome: () => void;
}

export const ConfirmationCard: React.FC<ConfirmationCardProps> = ({
  confirmationId,
  slot,
  recommendation,
  onBackToHome,
}) => {
  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return {
        date: date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        time: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      };
    } catch {
      return { date: slot, time: '' };
    }
  };

  const { date, time } = formatDateTime(slot);

  return (
    <div className="confirmation-card">
      <div className="confirmation-icon">✓</div>
      <h2 className="confirmation-title">Booking Confirmed</h2>

      <div className="confirmation-details">
        <div className="detail-item">
          <span className="detail-label">Confirmation ID:</span>
          <span className="detail-value">{confirmationId}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Appointment Type:</span>
          <span className="detail-value">{recommendation}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Date:</span>
          <span className="detail-value">{date}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Time:</span>
          <span className="detail-value">{time}</span>
        </div>
      </div>

      <button className="back-button" onClick={onBackToHome}>
        Return to Home
      </button>
    </div>
  );
};
