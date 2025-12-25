import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import OnboardingOverlay from "../../src/features/onboarding/onboarding-overlay";

vi.mock("../../src/features/onboarding/onboarding-context", () => ({
  useOnboardingContext: () => ({
    onboardingSteps: [{ title: "Paso 1", body: "Detalle", cta: "Siguiente" }],
    onboardingStep: 0,
    closeOnboarding: vi.fn(),
    prevOnboarding: vi.fn(),
    nextOnboarding: vi.fn(),
    handleOnboardingAction: vi.fn(),
  }),
}));

describe("OnboardingOverlay", () => {
  it("renderiza pasos y permite avanzar", () => {
    render(<OnboardingOverlay />);
    expect(screen.getByText("Paso 1")).toBeInTheDocument();
    const cta = screen.getByText(/Siguiente|Entendido/);
    fireEvent.click(cta);
  });
});
