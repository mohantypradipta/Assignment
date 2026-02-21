import React, { useState } from 'react';
import { Home } from './pages/Home';
import { QuestionnaireFlow } from './pages/QuestionnaireFlow';
import './App.scss';

type AppView = 'home' | 'questionnaire';

function App() {
  const [view, setView] = useState<AppView>('home');

  const handleStartQuestionnaire = () => {
    setView('questionnaire');
  };

  const handleBackToHome = () => {
    setView('home');
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-container">
          <h1 className="app-name" onClick={() => handleBackToHome()}>
            🏥 MedTriage
          </h1>
        </div>
      </header>

      <main className="app-main">
        {view === 'home' && <Home onStartQuestionnaire={handleStartQuestionnaire} />}
        {view === 'questionnaire' && <QuestionnaireFlow />}
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 Medical Triage. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
