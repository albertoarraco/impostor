import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import GameAnimation from '../../components/GameAnimation';
import './reveal-flow.css';

function RevealFlow({
  currentPlayer,
  revealed,
  onReveal,
  onNext,
  isLast,
}) {
  const [animationTrigger, setAnimationTrigger] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  const isImpostor = currentPlayer?.role === 'Impostor';
  const animationType = isImpostor ? 'impostor-reveal' : 'word-reveal';

  const initials = useMemo(
    () => (currentPlayer?.name || '?').slice(0, 2).toUpperCase(),
    [currentPlayer?.name]
  );

  useEffect(() => {
    if (revealed) {
      // disparo suave de animación al mostrar rol
      setAnimationTrigger(true);
      setTimeout(() => setAnimationTrigger(false), 300);
    }
  }, [revealed]);

  const handleReveal = () => {
    if (isRevealing) return;
    setIsRevealing(true);
    setAnimationTrigger(true);
    onReveal();

    setTimeout(() => {
      setIsRevealing(false);
      setAnimationTrigger(false);
    }, 900);
  };

  return (
    <div
      className={`reveal-card ${
        revealed ? (isImpostor ? 'impostor' : 'crew') : 'hidden'
      }`}
    >
      <div className="reveal-header">
        <div className="player-avatar">
          <div className="avatar-circle">
            <span>{initials}</span>
          </div>
          <div className="avatar-glow" />
        </div>
        <div className="player-info">
          <p className="eyebrow">Turno de revelación</p>
          <h3>{currentPlayer?.name}</h3>
          <p className="muted">Pasa el dispositivo, revela y sigue.</p>
        </div>
        <div className="pill step-pill">{isLast ? 'Último' : 'Siguiente'}</div>
      </div>

      {!revealed ? (
        <div className="reveal-body waiting">
          <div className="mystery-stack">
            <div className="mystery-card" />
            <div className="mystery-card top" />
            <div className="mystery-icon">?</div>
          </div>
          <p className="hint">Solo el jugador actual debe mirar.</p>
          <button
            className="btn pulse"
            type="button"
            onClick={handleReveal}
            disabled={isRevealing}
          >
            {isRevealing ? 'Revelando...' : 'Mostrar palabra'}
          </button>
        </div>
      ) : (
        <div className="reveal-body shown">
          <div className="role-hero">
            <GameAnimation
              type={animationType}
              trigger={animationTrigger}
              width="140px"
              height="140px"
              className="reveal-animation"
            />
            <div className={`role-badge ${isImpostor ? 'danger' : 'success'}`}>
              {currentPlayer?.role}
            </div>
          </div>

          <div className="cta-row">
            <button className="btn ghost" type="button" onClick={onNext}>
              {isLast ? 'Empezar partida' : 'Siguiente jugador'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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

export default RevealFlow;