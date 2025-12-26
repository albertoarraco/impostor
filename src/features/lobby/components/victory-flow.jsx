import PropTypes from 'prop-types';
import GameAnimation from '../../../components/GameAnimation';

const PlayerTrackerGrid = ({ roles, eliminated, toggleEliminated }) => (
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
);

PlayerTrackerGrid.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired, role: PropTypes.string })).isRequired,
  eliminated: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleEliminated: PropTypes.func.isRequired,
};

function VictoryFlow({
  hasVictory,
  victoryStage,
  setVictoryStage,
  victoryAllies,
  impostorsAlive,
  alliesAlive,
  impostorCount,
  roles,
  eliminated,
  toggleEliminated,
  celebrationTrigger,
  resetRound,
}) {
  if (hasVictory && victoryStage === 'banner') {
    return (
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
        <strong>{victoryAllies ? '¡Los aliados han ganado!' : '¡Los impostores han ganado!'}</strong>
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
            Confirmar finalización de la partida
          </button>
        </div>
      </div>
    );
  }

  if (hasVictory && victoryStage === 'prompt') {
    return (
      <div className="confirm-panel">
        <h4>¿Terminar la partida?</h4>
        <p className="muted small">Impostores vivos: {impostorsAlive} · Aliados vivos: {alliesAlive}</p>
        <p className="muted small">Confirma para ver el banner de ganador.</p>
        <div className="victory-actions">
          <button className="btn" type="button" onClick={() => setVictoryStage('review')}>
            Seguir revisando
          </button>
          <button className="btn primary" type="button" onClick={() => setVictoryStage('banner')}>
            Finalizar partida
          </button>
        </div>
      </div>
    );
  }

  if (hasVictory && victoryStage === 'review') {
    return (
      <div className="tracker-panel compact">
        <div className="tracker-header">
          <div>
            <p className="muted small">Revisa eliminados</p>
            <h4 className="tracker-title">Estado de jugadores</h4>
            <p className="muted small">Confirma cuando estés listo para cerrar.</p>
          </div>
        </div>
        <p className="muted small pre-victory-note">
          Si crees que marcaste mal a alguien, corrige antes de finalizar.
        </p>
        <div className="tracker-badges">
          <div className="stat-card imp">
            <p className="muted tiny">Impostores vivos</p>
            <div className="stat-main">
              <strong>{impostorsAlive}</strong>
              <span className="muted">/ {impostorCount || roles.filter((r) => r.role === 'Impostor').length}</span>
            </div>
          </div>
          <div className="stat-card out">
            <p className="muted tiny">Aliados vivos</p>
            <div className="stat-main">
              <strong>{alliesAlive}</strong>
              <span className="muted">/ {roles.filter((r) => r.role !== 'Impostor').length}</span>
            </div>
          </div>
        </div>
        <PlayerTrackerGrid roles={roles} eliminated={eliminated} toggleEliminated={toggleEliminated} />
        <div className="victory-actions">
          <button className="btn" type="button" onClick={() => setVictoryStage('prompt')}>
            Volver a confirmar
          </button>
          <button className="btn primary" type="button" onClick={() => setVictoryStage('banner')}>
            Finalizar partida
          </button>
        </div>
      </div>
    );
  }

  // estado normal: partida en curso
  return (
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
            <span className="muted">/ {impostorCount || roles.filter((r) => r.role === 'Impostor').length}</span>
          </div>
        </div>
        <div className="stat-card out">
          <p className="muted tiny">Aliados vivos</p>
          <div className="stat-main">
            <strong>{alliesAlive}</strong>
            <span className="muted">/ {roles.filter((r) => r.role !== 'Impostor').length}</span>
          </div>
        </div>
      </div>
      <PlayerTrackerGrid roles={roles} eliminated={eliminated} toggleEliminated={toggleEliminated} />
    </div>
  );
}

VictoryFlow.propTypes = {
  hasVictory: PropTypes.bool.isRequired,
  victoryStage: PropTypes.oneOf(['none', 'prompt', 'review', 'banner']).isRequired,
  setVictoryStage: PropTypes.func.isRequired,
  victoryAllies: PropTypes.bool.isRequired,
  impostorsAlive: PropTypes.number.isRequired,
  alliesAlive: PropTypes.number.isRequired,
  impostorCount: PropTypes.number.isRequired,
  roles: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, role: PropTypes.string })).isRequired,
  eliminated: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleEliminated: PropTypes.func.isRequired,
  celebrationTrigger: PropTypes.bool.isRequired,
  resetRound: PropTypes.func.isRequired,
};

export default VictoryFlow;
