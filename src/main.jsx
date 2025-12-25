import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GameStateProvider } from './contexts/GameStateContext';
import { OnboardingProvider } from './components/onboarding/OnboardingContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GameStateProvider>
      <OnboardingProvider>
        <App />
      </OnboardingProvider>
    </GameStateProvider>
  </React.StrictMode>,
);
