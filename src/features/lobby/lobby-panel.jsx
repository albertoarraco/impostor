import RevealFlow from './reveal-flow';
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
        <section className="panel">
          <div className="empty-state">
            <h3>No hay jugadores</h3>
            <p className="muted strong">Prepara la partida y haz clic en "Iniciar partida".</p>
            {cleanNames.length === 0 && <p className="muted small">Agrega jugadores para comenzar.</p>}
          </div>
          <div className="names-grid">
            {cleanNames.map((name, index) => (
              <div key={name} className="name-card">
                <strong>{name}</strong>
                <span>Jugador</span>
              </div>
            ))}
          </div>

          <div className="actions spaced">
            <button className="btn" type="button" onClick={() => setStep("config")}>
              Ajustar configuración
            </button>
            <button
              className={`btn primary ${!canStart ? 'disabled' : ''}`}
              type="button"
              disabled={!canStart}
              onClick={startGame}
              style={{ marginLeft: 'auto' }}
            >
              Iniciar partida
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="lobby-panel">
      {!started && roles.length === 0 && !allRevealed && (
        <section className="panel">
          <h2>Jugar partida</h2>
          {selectedCategory && (
            <p className="muted small" style={{ marginTop: '-6px', marginBottom: '12px' }}>
              Categoría: {selectedCategory}
            </p>
          )}
          {!started && (
            <>
              <div className="empty-state">
                <h3>Jugadores</h3>
                <p className="muted strong">Prepara la partida y haz clic en "Iniciar partida".</p>
                {cleanNames.length === 0 && <p className="muted small">Agrega jugadores para comenzar.</p>}
              </div>
              <div className="names-grid">
                {cleanNames.map((name) => (
                  <div key={name} className="name-card">
                    <small>Jugador</small>
                    <strong>{name}</strong>
                  </div>
                ))}
              </div>

              <div className="actions spaced">
                <button className="btn" type="button" onClick={() => setStep("config")}>
                  Ajustar configuración
                </button>
                <button
                  className={`btn primary ${!canStart ? 'disabled' : ''}`}
                  type="button"
                  disabled={!canStart}
                  onClick={startGame}
                  style={{ marginLeft: 'auto' }}
                >
                  Iniciar partida
                </button>
              </div>
            </>
          )}
        </section>
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
          {hasVictory ? (
            victoryStage === "banner" ? (
              <div className={`victory-banner full ${victoryAllies ? 'allies' : 'impostors'}`}>
                <div className="confetti-anim">
                  <GameAnimation
                    type="confetti"
                    trigger={celebrationTrigger}
                    width="180px"
                    height="180px"
                    className="celebration-animation"
                    loop={true}
                  />
                </div>
                <span className="muted tiny">Resultado</span>
                <strong>{victoryAllies ? "¡Los aliados han ganado!" : "¡Los impostores han ganado!"}</strong>
                <p className="muted small victory-note">
                  Revisa que los marcados como eliminados sean correctos antes de finalizar.
                </p>
                <div className="victory-actions">
                  <button
                    className="btn primary"
                    type="button"
                    onClick={() => {
                      resetRound();
                    }}
                  >
                    Empezar una partida nueva
                  </button>
                </div>
              </div>
            ) : victoryStage === "prompt" ? (
              <div className="confirm-panel">
                <h4>¿Terminar la partida?</h4>
                <p className="muted small">Impostores vivos: {impostorsAlive} · Aliados vivos: {alliesAlive}</p>
                <p className="muted small">Confirma para ver el banner de ganador.</p>
                <div className="victory-actions">
                  <button className="btn" type="button" onClick={() => setVictoryStage("review")}>
                    Seguir revisando
                  </button>
                  <button className="btn primary" type="button" onClick={() => setVictoryStage("banner")}>
                    Finalizar partida
                  </button>
                </div>
              </div>
            ) : (
              <div className="tracker-panel compact">
                <div className="tracker-header">
                  <div>
                    <p className="muted small">Resultado listo</p>
                    <h4 className="tracker-title">Confirma antes de finalizar</h4>
                    <p className="muted small">Revisa eliminados y confirma para ver el banner final.</p>
                  </div>
                </div>
                <div className="tracker-badges">
                  <div className="stat-card imp">
                    <p className="muted tiny">Impostores vivos</p>
                    <div className="stat-main">
                      <strong>{impostorsAlive}</strong>
                      <span className="muted">/ {impostorCount || roles.filter(r => r.role === "Impostor").length}</span>
                    </div>
                  </div>
                  <div className="stat-card out">
                    <p className="muted tiny">Aliados vivos</p>
                    <div className="stat-main">
                      <strong>{alliesAlive}</strong>
                      <span className="muted">/ {roles.filter(r => r.role !== "Impostor").length}</span>
                    </div>
                  </div>
                </div>
                <p className="muted small pre-victory-note">
                  Si crees que marcaste mal a alguien, corrige antes de finalizar.
                </p>
                <div className="tracker-grid">
                  {roles.map((player) => {
                    const isOut = eliminated.includes(player.name);
                    return (
                      <button
                        key={player.name}
                        type="button"
                        className={`tracker-chip ${isOut ? 'out' : ''}`}
                        onClick={() => toggleEliminated(player.name)}
                        aria-pressed={isOut}
                      >
                        <div className="chip-top">
                          <span className="chip-name">{player.name}</span>
                          <span className={`chip-pill ${isOut ? 'pill-out' : 'pill-active'}`}>
                            {isOut ? 'Eliminado' : 'Activo'}
                          </span>
                        </div>
                        <span className="chip-status muted small">Toca para alternar estado</span>
                      </button>
                    );
                  })}
                </div>
                <div className="victory-actions">
                  <button className="btn primary" type="button" onClick={() => setVictoryStage("banner")}>
                    Finalizar partida
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="tracker-panel compact">
              <div className="tracker-header">
                <div>
                  <p className="muted small">Partida en curso</p>
                  <h4 className="tracker-title">Estado de jugadores</h4>
                  <p className="muted small">Toca un jugador para marcarlo como eliminado o activo.</p>
                </div>
              </div>
              <p className="muted small pre-victory-note">
                Si crees que marcaste mal a alguien, corrige antes de terminar.
              </p>
              <div className="tracker-badges">
                <div className="stat-card imp">
                  <p className="muted tiny">Impostores vivos</p>
                  <div className="stat-main">
                    <strong>{impostorsAlive}</strong>
                    <span className="muted">/ {impostorCount || roles.filter(r => r.role === "Impostor").length}</span>
                  </div>
                </div>
                <div className="stat-card out">
                  <p className="muted tiny">Aliados vivos</p>
                  <div className="stat-main">
                    <strong>{alliesAlive}</strong>
                    <span className="muted">/ {roles.filter(r => r.role !== "Impostor").length}</span>
                  </div>
                </div>
              </div>
              <div className="tracker-grid">
                {roles.map((player) => {
                  const isOut = eliminated.includes(player.name);
                  return (
                    <button
                      key={player.name}
                      type="button"
                      className={`tracker-chip ${isOut ? 'out' : ''}`}
                      onClick={() => toggleEliminated(player.name)}
                      aria-pressed={isOut}
                    >
                      <div className="chip-top">
                        <span className="chip-name">{player.name}</span>
                        <span className={`chip-pill ${isOut ? 'pill-out' : 'pill-active'}`}>
                          {isOut ? 'Eliminado' : 'Activo'}
                        </span>
                      </div>
                      <span className="chip-status muted small">Toca para alternar estado</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default LobbyPanel;
