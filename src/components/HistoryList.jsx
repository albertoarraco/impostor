import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function HistoryList({ history, onSelect }) {
  const total = history.length;

  return (
    <section className="panel history">
      <div className="history-header">
        <h3>Partidas recientes</h3>
        <span className="muted">Total jugadas: {total}</span>
      </div>
      <div className="history-list">
        {history.map((entry) => (
          <div key={entry.timestamp} className="history-entry">
            <div className="history-meta">
              <strong>{entry.players.join(', ') || 'Sin nombres'}</strong>
              <div className="muted">
                Impostores: {entry.impostors}
                {entry.randomImpostors ? ' (aleatorio)' : ''}
              </div>
              {entry.wordCategory && (
                <div className="muted small">
                  Categoría: {entry.wordCategoryLabel || entry.wordCategory}
                </div>
              )}
              <span className="muted small">
                {format(entry.timestamp, 'PPpp', { locale: es })}
              </span>
            </div>
            <button className="btn" type="button" onClick={() => onSelect(entry)}>
              Usar
            </button>
          </div>
        ))}
        {history.length === 0 && <div className="muted">Sin historial aún.</div>}
      </div>
    </section>
  );
}

export default HistoryList;
