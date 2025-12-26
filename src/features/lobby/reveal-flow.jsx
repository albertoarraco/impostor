import PropTypes from 'prop-types';
import { useState } from 'react';
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

  const handleReveal = () => {
    setAnimationTrigger(true);
    onReveal();
    
    // Resetear el trigger para la próxima animación
    setTimeout(() => {
      setAnimationTrigger(false);
    }, 100);
  };

  const isImpostor = currentPlayer?.role === 'Impostor';
  const animationType = isImpostor ? 'impostor-reveal' : 'word-reveal';

  return (
    <div className="reveal-card">
      <div className="player-name">{currentPlayer?.name}</div>
      
      {!revealed ? (
        <button className="btn primary" type="button" onClick={handleReveal}>
          Mostrar palabra
        </button>
      ) : (
        <>
          <div className="reveal-content">
            <GameAnimation
              type={animationType}
              trigger={animationTrigger}
              width="120px"
              height="120px"
              className="reveal-animation"
            />
            <div
              className={`role-badge ${isImpostor ? 'danger' : 'success'}`}
            >
              {currentPlayer?.role}
            </div>
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
