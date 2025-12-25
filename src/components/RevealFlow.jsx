import PropTypes from 'prop-types';

function RevealFlow({
  currentPlayer,
  revealed,
  onReveal,
  onNext,
  isLast,
}) {
  return (
    <div className="reveal-card">
      <div className="player-name">{currentPlayer?.name}</div>
      {!revealed ? (
        <button className="btn primary" type="button" onClick={onReveal}>
          Mostrar palabra
        </button>
      ) : (
        <>
          <div
            className={`role-badge ${currentPlayer?.role === 'Impostor' ? 'danger' : 'success'}`}
          >
            {currentPlayer?.role}
          </div>
          <button className="btn" type="button" onClick={onNext}>
            {isLast ? 'Empezar partida' : 'Siguiente jugador'}
          </button>
        </>
      )}
    </div>
  );
}

export default RevealFlow;

RevealFlow.propTypes = {
  currentPlayer: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
  }),
  revealed: PropTypes.bool.isRequired,
  onReveal: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  isLast: PropTypes.bool.isRequired,
};
