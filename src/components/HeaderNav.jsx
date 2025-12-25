import PropTypes from 'prop-types';

const steps = {
  home: 'Inicio',
  lobby: 'Jugar partida',
  history: 'Historial de partidas',
  config: 'Configuración',
};

function HeaderNav({ step, onStepChange }) {
  return (
    <div className="actions">
      {Object.entries(steps).map(([key, label]) => (
        <button
          key={key}
          className={`btn ${step === key ? 'primary' : ''}`}
          type="button"
          onClick={() => onStepChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

HeaderNav.propTypes = {
  step: PropTypes.oneOf(['home', 'lobby', 'history', 'config']).isRequired,
  onStepChange: PropTypes.func.isRequired,
};

export { steps };
export default HeaderNav;
