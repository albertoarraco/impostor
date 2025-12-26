import RevealFlow from './reveal-flow';
import SetupSection from './components/setup-section';
import VictoryFlow from './components/victory-flow';
import { useGame } from "../../contexts/game-state-context";
import { useState, useEffect } from 'react';
import GameAnimation from '../../components/GameAnimation';
import './lobby-panel.css';

function LobbyPanel() {
  const {
    navigation: { setStep, setConfigTab },
    lobby,
  } = useGame();

  const {
    started,
    canStart,
    cleanNames,
    roles,
    impostorCount,
    impostorsAlive,
    alliesAlive,
    eliminated,
    revealIndex,
    revealed,
    allRevealed,
    currentPlayer,
    selectedCategory,
    startGame,
    setRevealed,
    setRevealIndex,
    setAllRevealed,
    resetRound,
    setSecretWord,
    toggleEliminated,
  } = lobby;

  const [celebrationTrigger, setCelebrationTrigger] = useState(false);
  const [victoryStage, setVictoryStage] = useState("none"); // none | prompt | review | banner

  // Disparar celebración cuando todos son revelados
  useEffect(() => {
    if (allRevealed && roles.length > 0) {
      setCelebrationTrigger(true);
      
      // Resetear el trigger para la próxima vez
      setTimeout(() => {
        setCelebrationTrigger(false);
      }, 100);
    }
  }, [allRevealed, roles.length]);

  const handleNext = () => {
    if (!roles.length) return;
    const isLastPlayer =
      roles.length > 0 &&
      currentPlayer &&
      roles[roles.length - 1]?.name === currentPlayer?.name;
    setRevealed(false);
    if (isLastPlayer) {
      setAllRevealed(true);
      setRevealIndex(roles.length - 1);
      return;
    }
    setRevealIndex((i) => Math.min(roles.length - 1, i + 1));
  };

  const isLast =
    roles.length > 0 &&
    currentPlayer &&
    roles[roles.length - 1]?.name === currentPlayer?.name;

  const hasVictory = impostorsAlive === 0 || alliesAlive === 0;
  const victoryAllies = started && hasVictory && impostorsAlive === 0;
  const victoryImpostors = started && hasVictory && alliesAlive === 0;
  const hasPlayers = cleanNames?.length > 0;

  useEffect(() => {
    if (!hasVictory) {
      setVictoryStage("none");
    } else if (victoryStage === "none") {
      setVictoryStage("prompt");
    }
  }, [hasVictory, victoryStage]);

  if (!cleanNames?.length) {
    return (
      <div className="lobby-panel">
        <SetupSection
          cleanNames={cleanNames}
          canStart={canStart}
          setStep={setStep}
          startGame={startGame}
          selectedCategory={selectedCategory}
          hasPlayers={hasPlayers}
        />
      </div>
    );
  }

  return (
    <div className="lobby-panel">
      {!started && !allRevealed && (
        <SetupSection
          cleanNames={cleanNames}
          canStart={canStart}
          setStep={setStep}
          startGame={startGame}
          selectedCategory={selectedCategory}
          hasPlayers={hasPlayers}
        />
      )}
      {started && roles.length > 0 && !allRevealed && (<>
        <div className="reveal-box">
          <h3>Revelación de roles</h3>
          <p className="muted">Muestra la pantalla al jugador, revela su palabra y luego pasa.</p>
          <div className="actions spaced" style={{ marginTop: '12px' }}>
            <button
              className="btn ghost"
              type="button"
              onClick={() => {
                resetRound();
              }}
            >
              Volver a configurar la partida
            </button>
          </div>
        </div>
            <RevealFlow
            currentPlayer={currentPlayer}
            revealed={revealed}
            onReveal={() => setRevealed(true)}
            onNext={
              isLast
                ? () => {
                    setRevealed(false);
                    setAllRevealed(true);
                    setRevealIndex(roles.length - 1);
                  }
                : handleNext
            }
            isLast={isLast}
          />
      </>)}

      {started && allRevealed && (
        <>
          <VictoryFlow
            hasVictory={hasVictory}
            victoryStage={victoryStage}
            setVictoryStage={setVictoryStage}
            victoryAllies={victoryAllies}
            impostorsAlive={impostorsAlive}
            alliesAlive={alliesAlive}
            impostorCount={impostorCount}
            roles={roles}
            eliminated={eliminated}
            toggleEliminated={toggleEliminated}
            celebrationTrigger={celebrationTrigger}
            resetRound={resetRound}
          />
        </>
      )}
    </div>
  );
}

export default LobbyPanel;
