import { useEffect } from "react";
import HeaderNav from "./components/HeaderNav";
import HomePanel from "./components/HomePanel";
import ConfigPanel from "./components/ConfigPanel";
import LobbyPanel from "./components/LobbyPanel";
import HistoryList from "./components/HistoryList";
import WordsPanel from "./components/WordsPanel";
import TransferPanel from "./components/TransferPanel";
import OnboardingOverlay from "./components/onboarding/OnboardingOverlay";
import { useOnboardingContext } from "./components/onboarding/OnboardingContext";
import { useGame } from "./contexts/GameStateContext";
import "./App.css";

function App() {
  const {
    navigation: { step, setStep, configTab, setConfigTab },
  } = useGame();

  const {
    showOnboarding,
    openOnboarding,
  } = useOnboardingContext();

  useEffect(() => {
    if (typeof window === "undefined" || !window.gtag) return;
    const page =
      step === "config"
        ? `/config/${configTab}`
        : step === "lobby"
        ? "/lobby"
        : step === "history"
        ? "/history"
        : "/";
    window.gtag("config", "G-4XJYFVH9FJ", {
      page_path: page,
    });
  }, [step, configTab]);

  return (
    <div className="page">
      <header className="hero">
        <div className="pill">Juego de impostor</div>
        <h1>El impostor</h1>
        <p>Define jugadores, número de impostores y arranca la partida.</p>
        <HeaderNav step={step} onStepChange={setStep} />
        <div className="hero-actions">
          <button className="btn" type="button" onClick={openOnboarding}>
            Guía rápida
          </button>
        </div>
      </header>

      {step === "home" && <HomePanel />}

      {step === "config" && (
        <section className="panel">
          <div className="actions" style={{ gap: "8px", flexWrap: "wrap" }}>
            <button
              className={`btn ${configTab === "game" ? "primary" : ""}`}
              type="button"
              onClick={() => setConfigTab("game")}
            >
              Configuración del juego
            </button>
            <button
              className={`btn ${configTab === "words" ? "primary" : ""}`}
              type="button"
              onClick={() => setConfigTab("words")}
            >
              Palabras
            </button>
            <button
              className={`btn ${configTab === "transfer" ? "primary" : ""}`}
              type="button"
              onClick={() => setConfigTab("transfer")}
            >
              Compartir
            </button>
          </div>

          <div style={{ marginTop: "16px" }}>
            {configTab === "game" && <ConfigPanel />}

            {configTab === "words" && <WordsPanel />}

            {configTab === "transfer" && <TransferPanel />}
          </div>
        </section>
      )}

      {step === "lobby" && <LobbyPanel />}

      {step === "history" && <HistoryList />}

      {step === "palabras" && <WordsPanel />}

      {step === "transfer" && <TransferPanel />}

      {showOnboarding && <OnboardingOverlay />}
    </div>
  );
}

export default App;
