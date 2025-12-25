import { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { useGame } from "../../contexts/game-state-context";
import useOnboarding from './use-onboarding';
import onboardingSteps from './onboarding-steps';

const OnboardingContext = createContext(null);

export function OnboardingProvider({ children }) {
  const {
    navigation: { setStep, setConfigTab },
  } = useGame();

  const onboarding = useOnboarding({ setStep, setConfigTab });

  return <OnboardingContext.Provider value={onboarding}>{children}</OnboardingContext.Provider>;
}

export function useOnboardingContext() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboardingContext must be used within OnboardingProvider");
  return ctx;
}

export default OnboardingContext;

OnboardingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
