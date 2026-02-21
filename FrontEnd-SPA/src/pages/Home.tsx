import React, { useState, useEffect } from 'react';
import { useTriageStore } from '../store/useTriageStore';
import '../styles/Home.scss';

interface HomeProps {
  onStartQuestionnaire: () => void;
}

export const Home: React.FC<HomeProps> = ({ onStartQuestionnaire }) => {
  const [waitingTime, setWaitingTime] = useState<string | null>(null);
  const [upcomingAppointment, setUpcomingAppointment] = useState<{
    time: string;
    type: string;
  } | null>(null);

  useEffect(() => {
    // Simulate fetching waiting time
    const calculateWaitingTime = () => {
      const randomMinutes = Math.floor(Math.random() * 10) + 10; // 10-20 minutes
      setWaitingTime(`${randomMinutes} mins`);
    };

    calculateWaitingTime();

    // Check if there's an upcoming appointment stored
    const storedAppointment = localStorage.getItem('upcomingAppointment');
    if (storedAppointment) {
      try {
        setUpcomingAppointment(JSON.parse(storedAppointment));
      } catch (e) {
        console.error('Failed to parse appointment:', e);
      }
    }
  }, []);

  return (
    <div className="home">
      <div className="home-container">
        <h1 className="home-title">Medical Triage</h1>

        <div className="hero-section">
          <h2 className="hero-title">
            See a doctor in <span className="waiting-time">{waitingTime || '...'}</span>
          </h2>

          {upcomingAppointment && (
            <div className="upcoming-appointment">
              <h3>Your Next Appointment</h3>
              <p className="appointment-type">{upcomingAppointment.type}</p>
              <p className="appointment-time">{upcomingAppointment.time}</p>
            </div>
          )}

          <button className="btn btn-primary btn-large" onClick={onStartQuestionnaire}>
            Book Appointment
          </button>
        </div>

        <div className="info-section">
          <h3>How it works:</h3>
          <ol>
            <li>Answer 5 quick questions about your symptoms</li>
            <li>Get a personalized recommendation</li>
            <li>Choose from available appointment times</li>
            <li>Receive your confirmation</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
