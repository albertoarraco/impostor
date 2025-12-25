import { useCallback, useEffect, useMemo, useState } from "react";
import storageKeys from "../../constants/storage-keys";
import onboardingSteps from "./onboarding-steps";

function useOnboarding({ setStep, setConfigTab }) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  const totalOnboardingSteps = onboardingSteps.length;

  const openOnboarding = useCallback(() => setShowOnboarding(true), []);

  const closeOnboarding = useCallback(() => {
    setShowOnboarding(false);
    localStorage.setItem(storageKeys.onboardingDismissed, "1");
  }, []);

  const prevOnboarding = useCallback(
    () => setOnboardingStep((prev) => Math.max(0, prev - 1)),
    []
  );

  const nextOnboarding = useCallback(
    (isLast = false) => {
      if (isLast) {
        closeOnboarding();
      } else {
        setOnboardingStep((prev) => Math.min(totalOnboardingSteps - 1, prev + 1));
      }
    },
    [closeOnboarding, totalOnboardingSteps]
  );

  const handleOnboardingAction = useCallback(
    (_idx, stepDef) => {
      if (stepDef?.targetStep) setStep(stepDef.targetStep);
      if (stepDef?.targetConfigTab) setConfigTab(stepDef.targetConfigTab);
    },
    [setConfigTab, setStep]
  );

  useEffect(() => {
    const onboardingDismissed = localStorage.getItem(storageKeys.onboardingDismissed);
    if (!onboardingDismissed) {
      setShowOnboarding(true);
    }
  }, []);

  const onboardingControls = useMemo(
    () => ({
      showOnboarding,
      onboardingStep,
      onboardingSteps,
      totalOnboardingSteps,
      openOnboarding,
      closeOnboarding,
      prevOnboarding,
      nextOnboarding,
      handleOnboardingAction,
    }),
    [
      showOnboarding,
      onboardingStep,
      totalOnboardingSteps,
      openOnboarding,
      closeOnboarding,
      prevOnboarding,
      nextOnboarding,
      handleOnboardingAction,
    ]
  );

  return onboardingControls;
}

export default useOnboarding;
