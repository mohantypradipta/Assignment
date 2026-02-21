import React, { useState, useEffect } from 'react';
import { useTriageStore } from '../store/useTriageStore';
import { QuestionCard } from '../components/QuestionCard';
import { RecommendationCard } from '../components/RecommendationCard';
import { SlotSelector } from '../components/SlotSelector';
import { ConfirmationCard } from '../components/ConfirmationCard';
import { assessmentAPI } from '../api/assessmentAPI';
import '../styles/QuestionnaireFlow.scss';

interface AssessmentResponse {
  recommendation: 'Chat' | 'Nurse' | 'Doctor';
  availableSlots: string[];
}

interface BookingResponse {
  confirmationId: string;
  slot: string;
  recommendation: 'Chat' | 'Nurse' | 'Doctor';
}

type FlowStage = 'question' | 'recommendation' | 'booking' | 'confirmation';

const QUESTIONS = [
  {
    id: 1,
    title: 'How would you describe your main symptom?',
    options: [
      { label: 'Mild discomfort', score: 1 },
      { label: 'Moderate pain', score: 2 },
      { label: 'Severe pain', score: 3 },
    ],
  },
  {
    id: 2,
    title: 'How long have you had this symptom?',
    options: [
      { label: 'Less than 24 hours', score: 1 },
      { label: '1–3 days', score: 2 },
      { label: 'More than 3 days', score: 3 },
    ],
  },
  {
    id: 3,
    title: 'Does the symptom affect your ability to carry out daily activities?',
    options: [
      { label: 'Not at all', score: 1 },
      { label: 'Somewhat', score: 2 },
      { label: 'Significantly', score: 3 },
    ],
  },
  {
    id: 4,
    title: 'Have you experienced this symptom before?',
    options: [
      { label: 'Yes, and it resolved on its own', score: 1 },
      { label: 'Yes, and it needed treatment', score: 2 },
      { label: 'No, this is new', score: 3 },
    ],
  },
  {
    id: 5,
    title: 'Do you have any of the following: fever above 38°C, difficulty breathing, or chest pain?',
    options: [
      { label: 'None of these', score: 1 },
      { label: 'One of these', score: 2 },
      { label: 'Two or more of these', score: 3 },
    ],
  },
];

export const QuestionnaireFlow: React.FC = () => {
  const {
    currentQuestion,
    answers,
    totalScore,
    setAnswer,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    resetQuestionnaire,
    calculateScore,
  } = useTriageStore();

  const [flowStage, setFlowStage] = useState<FlowStage>('question');
  const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const question = QUESTIONS[currentQuestion - 1];
  const selectedScore = answers[currentQuestion];

  const handleAnswerQuestion = (score: number) => {
    setAnswer(currentQuestion, score);
  };

  const handleNextQuestion = async () => {
    if (currentQuestion === 5) {
      // Submit assessment
      setLoading(true);
      setError(null);
      try {
        const score = Object.values(answers).reduce((sum, val) => sum + val, 0);
        calculateScore();
        const response = await assessmentAPI.submitAssessment(score);
        setAssessment(response);
        setFlowStage('recommendation');
      } catch (err) {
        setError('Failed to get assessment. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      nextQuestion();
    }
  };

  const handleProceedToBooking = () => {
    setFlowStage('booking');
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot || !assessment) return;

    setLoading(true);
    setError(null);
    try {
      const response = await assessmentAPI.bookAppointment(
        selectedSlot,
        assessment.recommendation
      );
      setBooking(response);
      setFlowStage('confirmation');
    } catch (err) {
      setError('Failed to book appointment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    resetQuestionnaire();
    setFlowStage('question');
    setAssessment(null);
    setBooking(null);
    setSelectedSlot(null);
    setError(null);
  };

  const handleCancel = () => {
    handleBackToHome();
  };

  return (
    <div className="questionnaire-flow">
      {error && <div className="error-message">{error}</div>}

      {flowStage === 'question' && (
        <div className="question-stage">
          <QuestionCard
            question={currentQuestion}
            title={question.title}
            options={question.options}
            selectedScore={selectedScore}
            onSelect={handleAnswerQuestion}
          />

          <div className="navigation-buttons">
            <button
              className="btn btn-secondary"
              onClick={previousQuestion}
              disabled={currentQuestion === 1}
              aria-label="Previous question"
            >
              ← Previous
            </button>

            <button
              className="btn btn-primary"
              onClick={handleNextQuestion}
              disabled={selectedScore === undefined || loading}
              aria-label={currentQuestion === 5 ? 'Submit assessment' : 'Next question'}
            >
              {loading ? 'Submitting...' : currentQuestion === 5 ? 'Submit' : 'Next →'}
            </button>

            <button
              className="btn btn-danger"
              onClick={handleCancel}
              aria-label="Cancel and return to home"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {flowStage === 'recommendation' && assessment && (
        <div className="recommendation-stage">
          <RecommendationCard
            recommendation={assessment.recommendation}
            score={totalScore}
          />

          <div className="recommendation-buttons">
            <button
              className="btn btn-primary"
              onClick={handleProceedToBooking}
              aria-label="Proceed to book appointment"
            >
              Book Appointment →
            </button>

            <button
              className="btn btn-secondary"
              onClick={handleCancel}
              aria-label="Cancel and return to home"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {flowStage === 'booking' && assessment && (
        <div className="booking-stage">
          <SlotSelector
            slots={assessment.availableSlots}
            onSelectSlot={setSelectedSlot}
            isLoading={loading}
          />

          <div className="booking-buttons">
            <button
              className="btn btn-primary"
              onClick={handleBookAppointment}
              disabled={!selectedSlot || loading}
              aria-label="Confirm appointment booking"
            >
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => setFlowStage('recommendation')}
              aria-label="Back to recommendation"
            >
              ← Back
            </button>

            <button
              className="btn btn-danger"
              onClick={handleCancel}
              aria-label="Cancel and return to home"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {flowStage === 'confirmation' && booking && (
        <div className="confirmation-stage">
          <ConfirmationCard
            confirmationId={booking.confirmationId}
            slot={booking.slot}
            recommendation={booking.recommendation}
            onBackToHome={handleBackToHome}
          />
        </div>
      )}
    </div>
  );
};
