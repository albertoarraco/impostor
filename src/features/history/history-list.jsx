import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useGame } from "../../contexts/game-state-context";
import './history-list.css';

// Iconos SVG simples
const CalendarIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

function HistoryList() {
  const {
    history: { list },
    config,
    words,
    lobby,
    navigation: { setStep, setConfigTab },
  } = useGame();

  const baseKeys = new Set((words.baseCategoryOptions || []).map((c) => c.key));

  const total = list.length;

  return (
    <section className="panel history">
      <div className="history-header">
        <h3>Partidas recientes</h3>
        <span className="muted">Total jugadas: {total}</span>
      </div>
      <div className="history-list">
        {list.map((entry) => {
          const missingCustom =
            entry.wordCategory &&
            !baseKeys.has(entry.wordCategory) &&
            !words.customCategories?.[entry.wordCategory];
          return (
            <div key={entry.timestamp} className="history-entry">
              <div className="history-meta">
                <div className="calendar-section">
                  <div className="calendar-date">
                    <div className="month">{format(entry.timestamp, 'MMM', { locale: es })}</div>
                    <div className="day">{format(entry.timestamp, 'dd', { locale: es })}</div>
                  </div>
                </div>
                <div className="game-info">
                  <strong style={{marginBottom: 8}}>{entry.players.join(', ') || 'Sin nombres'}</strong>
                  <div className="game-tags">
                    <span className="tag impostors">
                      Impostor{entry.impostors > 1 ? 'es' : ''}: {entry.impostors} 
                      {entry.randomImpostors && ' (aleatorio)'}
                    </span>
                    {entry.wordCategory && (
                      <span className={`tag category ${missingCustom ? 'missing' : ''}`}>
                        Categoría: {entry.wordCategoryLabel || entry.wordCategory}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {missingCustom && (
                <div className="warning-message">
                  Categoría personalizada no disponible
                </div>
              )}
              <button
                className="btn"
                type="button"
                disabled={missingCustom}
                title={missingCustom ? 'La categoría personalizada ya no existe' : undefined}
                onClick={() => {
                  if (missingCustom) return;
                  config.setNames(entry.players);
                  config.setImpostors(entry.impostors);
                  config.setRandomImpostors?.(Boolean(entry.randomImpostors));
                  if (entry.wordCategory) words.setWordCategory(entry.wordCategory);
                  if (entry.customCategories) words.setCustomCategories(entry.customCategories);
                  if (entry.extraWords) words.setExtraWords(entry.extraWords);
                  if (entry.word) lobby.setSecretWord(entry.word);
                  setConfigTab("game");
                  setStep("config");
                }}
              >
                Usar configuración
              </button>
            </div>
          );
        })}
        {list.length === 0 && <div className="muted">Sin historial aún.</div>}
      </div>
    </section>
  );
}

export default HistoryList;
