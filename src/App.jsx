import { useEffect, Suspense, lazy } from "react";
import HeaderNav from "./components/HeaderNav";
import HomePanel from "./components/HomePanel";
import { useOnboardingContext } from "./components/onboarding/OnboardingContext";
import { useGame } from "./contexts/GameStateContext";
import "./App.css";

const ConfigPanel = lazy(() => import("./components/ConfigPanel"));
const LobbyPanel = lazy(() => import("./components/LobbyPanel"));
const HistoryList = lazy(() => import("./components/HistoryList"));
const WordsPanel = lazy(() => import("./components/WordsPanel"));
const TransferPanel = lazy(() => import("./components/TransferPanel"));
const OnboardingOverlay = lazy(() => import("./components/onboarding/OnboardingOverlay"));

function App() {
  const {
    navigation: { step, setStep, configTab, setConfigTab },
  } = useGame();

  const {
    showOnboarding,
    openOnboarding,
  } = useOnboardingContext();

  useEffect(() => {
    if (!globalThis.window?.gtag) return;
    let page;
    if (step === "config") {
      page = `/config/${configTab}`;
    } else if (step === "lobby") {
      page = "/lobby";
    } else if (step === "history") {
      page = "/history";
    } else {
      page = "/";
    }
    globalThis.window.gtag("config", "G-4XJYFVH9FJ", {
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

      <Suspense fallback={<div className="panel">Cargando…</div>}>
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
              {configTab === "game" && (
                <Suspense fallback={<div>Cargando configuración...</div>}>
                  <ConfigPanel />
                </Suspense>
              )}

              {configTab === "words" && (
                <Suspense fallback={<div>Cargando palabras...</div>}>
                  <WordsPanel />
                </Suspense>
              )}

              {configTab === "transfer" && (
                <Suspense fallback={<div>Cargando transferencia...</div>}>
                  <TransferPanel />
                </Suspense>
              )}
            </div>
          </section>
        )}

        {step === "lobby" && (
          <Suspense fallback={<div>Cargando partida...</div>}>
            <LobbyPanel />
          </Suspense>
        )}

        {step === "history" && (
          <Suspense fallback={<div>Cargando historial...</div>}>
            <HistoryList />
          </Suspense>
        )}

        {step === "palabras" && (
          <Suspense fallback={<div>Cargando palabras...</div>}>
            <WordsPanel />
          </Suspense>
        )}

        {step === "transfer" && (
          <Suspense fallback={<div>Cargando transferencia...</div>}>
            <TransferPanel />
          </Suspense>
        )}

        {showOnboarding && (
          <Suspense fallback={null}>
            <OnboardingOverlay />
          </Suspense>
        )}
      </Suspense>
    </div>
  );
}

export default App;
