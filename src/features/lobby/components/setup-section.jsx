import PropTypes from 'prop-types';

function SetupSection({ cleanNames, canStart, setStep, startGame, selectedCategory, hasPlayers }) {
  return (
    <section className="panel">
      <h2>Jugar partida</h2>
      {selectedCategory && (
        <p className="muted small" style={{ marginTop: '-6px', marginBottom: '12px' }}>
          Categoría: {selectedCategory}
        </p>
      )}
      <div className="empty-state">
        <h3>Jugadores</h3>
        <p className="muted strong">Prepara la partida y haz clic en "Iniciar partida".</p>
        {cleanNames.length === 0 && <p className="muted small">Agrega jugadores para comenzar.</p>}
      </div>
      <div className="names-grid">
        {cleanNames.map((name, index) => (
          <div key={`name-${index}`} className="name-card">
            <small>Jugador</small>
            <strong>{name || 'Jugador'}</strong>
          </div>
        ))}
      </div>

      <div className="actions spaced">
        <button className="btn" type="button" onClick={() => setStep('config')}>
          Ajustar configuración
        </button>
        <button
          className={`btn primary ${!canStart ? 'disabled' : ''}`}
          type="button"
          disabled={!canStart || !hasPlayers}
          onClick={startGame}
          style={{ marginLeft: 'auto' }}
        >
          Iniciar partida
        </button>
      </div>
    </section>
  );
}

SetupSection.propTypes = {
  cleanNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  canStart: PropTypes.bool.isRequired,
  setStep: PropTypes.func.isRequired,
  startGame: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string,
  hasPlayers: PropTypes.bool.isRequired,
};

export default SetupSection;
