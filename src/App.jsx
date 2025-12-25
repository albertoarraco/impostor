import { useEffect, Suspense, lazy } from "react";
import HeaderNav from "./features/shared/ui/header-nav";
import HomePanel from "./features/home/home-panel";
import LoadingSpinner from "./features/shared/loading-spinner/loading-spinner";
import { useOnboardingContext } from "./features/onboarding/onboarding-context";
import { useGame } from "./contexts/game-state-context";
import "./App.css";

const ConfigPanel = lazy(() => import("./features/config/game-config/game-config"));
const LobbyPanel = lazy(() => import("./features/lobby/lobby-panel"));
const HistoryList = lazy(() => import("./features/history/history-list"));
const WordsPanel = lazy(() => import("./features/config/word-config/word-config"));
const TransferPanel = lazy(() => import("./features/config/transfer-config/transfer-config"));
const OnboardingOverlay = lazy(() => import("./features/onboarding/onboarding-overlay"));

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

      <Suspense fallback={<LoadingSpinner />}>
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
                <Suspense fallback={<LoadingSpinner message="Cargando configuración..." />}>
                  <ConfigPanel />
                </Suspense>
              )}

              {configTab === "words" && (
                <Suspense fallback={<LoadingSpinner message="Cargando palabras..." />}>
                  <WordsPanel />
                </Suspense>
              )}

              {configTab === "transfer" && (
                <Suspense fallback={<LoadingSpinner message="Cargando transferencia..." />}>
                  <TransferPanel />
                </Suspense>
              )}
            </div>
          </section>
        )}

        {step === "lobby" && (
          <Suspense fallback={<LoadingSpinner message="Cargando partida..." />}>
            <LobbyPanel />
          </Suspense>
        )}

        {step === "history" && (
          <Suspense fallback={<LoadingSpinner message="Cargando historial..." />}>
            <HistoryList />
          </Suspense>
        )}

        {step === "palabras" && (
          <Suspense fallback={<LoadingSpinner message="Cargando palabras..." />}>
            <WordsPanel />
          </Suspense>
        )}

        {step === "transfer" && (
          <Suspense fallback={<LoadingSpinner message="Cargando transferencia..." />}>
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
