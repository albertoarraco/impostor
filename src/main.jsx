import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GameStateProvider } from './contexts/game-state-context';
import { OnboardingProvider } from './features/onboarding/onboarding-context';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GameStateProvider>
      <OnboardingProvider>
        <App />
      </OnboardingProvider>
    </GameStateProvider>
  </React.StrictMode>,
);
