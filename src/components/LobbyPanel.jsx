import RevealFlow from './RevealFlow';

function LobbyPanel({
  started,
  canStart,
  cleanNames,
  roles,
  revealed,
  allRevealed,
  secretWord,
  currentPlayer,
  selectedCategory,
  onStartGame,
  onConfig,
  onReveal,
  onNext,
  onRestart,
}) {
  const isLast = roles.length > 0 && roles.indexOf(currentPlayer) === roles.length - 1;

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
            <p className="muted strong">Prepara la partida y haz clic en “Empezar partida”.</p>
            {cleanNames.length === 0 && <p className="muted small">Agrega jugadores para comenzar.</p>}
          </div>
          <div className="names-grid">
            {cleanNames.map((name, index) => (
              <div key={index} className="name-card">
                <strong>{name}</strong>
                <span>Jugador</span>
              </div>
            ))}
          </div>

          <div className="actions spaced">
            <button className="btn" type="button" onClick={onConfig}>
              Ajustar configuración
            </button>
            <button
              className={`btn primary ${!canStart ? 'disabled' : ''}`}
              type="button"
              disabled={!canStart}
              onClick={onStartGame}
            >
              Empezar partida
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
            onReveal={onReveal}
            onNext={onNext}
            isLast={isLast}
          />
        </div>
      )}

      {started && allRevealed && (
        <div className="in-game-box">
          <p className="hint">Partida en curso</p>
          <button className="btn primary" type="button" onClick={onRestart}>
            Empezar otra partida
          </button>
        </div>
      )}
    </section>
  );
}

export default LobbyPanel;
