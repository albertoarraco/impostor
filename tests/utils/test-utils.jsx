import { render } from "@testing-library/react";
import { GameStateProvider } from "../../src/contexts/GameStateContext";
import { OnboardingProvider } from "../../src/components/onboarding/OnboardingContext";

export function renderWithProviders(ui, options = {}) {
  return render(
    <GameStateProvider>
      <OnboardingProvider>{ui}</OnboardingProvider>
    </GameStateProvider>,
    options
  );
}

export default renderWithProviders;
