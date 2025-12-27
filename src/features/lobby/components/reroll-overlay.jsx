import PropTypes from 'prop-types';

function RerollOverlay({ message, submessage }) {
  return (
    <div className="reroll-overlay" role="status" aria-live="polite">
      <div className="reroll-modal">
        <div className="dice-spinner" aria-hidden="true">🎲</div>
        <div>
          <p className="muted strong" style={{ marginBottom: 6 }}>{message}</p>
          <p className="muted small">{submessage}</p>
        </div>
      </div>
    </div>
  );
}

RerollOverlay.propTypes = {
  message: PropTypes.string.isRequired,
  submessage: PropTypes.string.isRequired,
};

export default RerollOverlay;
