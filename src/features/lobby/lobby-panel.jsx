import RevealFlow from './reveal-flow';
import { useGame } from "../../contexts/game-state-context";
import './lobby-panel.css';

function LobbyPanel() {
  const {
    navigation: { setStep },
    lobby,
  } = useGame();

  const {
    started,
    canStart,
    cleanNames,
    roles,
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
  } = lobby;

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

  if (!cleanNames?.length) {
    return (
      <section className="panel">
        <h2>Lobby</h2>
        <p className="muted">Configura jugadores e impostores para iniciar la partida.</p>
        {selectedCategory && (
          <p className="muted small" style={{ marginTop: '-6px', marginBottom: '12px' }}>
            Categoría: {selectedCategory}
          </p>
        )}
        <div className="info-box">
          <p className="muted strong">Prepara la partida y haz clic en “Iniciar partida”.</p>
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
    );
  }

  return (
    <section className="panel">
      <h2>Jugar partida</h2>
      {selectedCategory && (
        <p className="muted small" style={{ marginTop: '-6px', marginBottom: '12px' }}>
          Categoría: {selectedCategory}
        </p>
      )}
      {!started && (
        <>
          <div className="info-box">
            <p className="muted strong">Prepara la partida y haz clic en “Iniciar partida”.</p>
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
        </>
      )}

      {started && roles.length > 0 && !allRevealed && (
        <div className="reveal-box">
          <h3>Revelación de roles</h3>
          <p className="muted">Muestra la pantalla al jugador, revela su palabra y luego pasa.</p>
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
        </div>
      )}

      {started && allRevealed && (
        <div className="in-game-box">
          <p className="hint">Partida en curso</p>
          <button className="btn primary" type="button" onClick={resetRound}>
            Empezar otra partida
          </button>
        </div>
      )}
    </section>
  );
}

export default LobbyPanel;
