import "./onboarding-overlay.css";
import { useOnboardingContext } from './onboarding-context';

function OnboardingOverlay() {
  const {
    onboardingSteps: steps,
    onboardingStep: currentStep,
    closeOnboarding,
    prevOnboarding,
    nextOnboarding,
    handleOnboardingAction,
  } = useOnboardingContext();

  const step = steps[currentStep] || {};
  const isLast = currentStep >= steps.length - 1;

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card">
        <div className="onboarding-header">
          <span className="pill small">Recorrido</span>
          <button className="btn" type="button" onClick={closeOnboarding} style={{width: 'auto'}}>
            Cerrar
          </button>
        </div>
        <h3>{step.title}</h3>
        <p className="muted">{step.body}</p>
        <div className="actions spaced" style={{ marginTop: "6px" }}>
          <button className="btn" type="button" onClick={prevOnboarding} disabled={currentStep === 0}>
            Anterior
          </button>
          <div className="actions" style={{ gap: "8px" }}>
            <button
              className="btn primary"
              type="button"
              onClick={() => {
                handleOnboardingAction?.(currentStep, step);
                nextOnboarding(isLast);
              }}
            >
              {isLast ? "Entendido" : step.cta}
            </button>
          </div>
        </div>
        <div className="progress">
          {steps.map((_, idx) => (
            <span key={idx} className={`dot ${idx === currentStep ? "active" : ""}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default OnboardingOverlay;
