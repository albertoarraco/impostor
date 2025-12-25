import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useGame } from "../contexts/GameStateContext";

function HistoryList() {
  const {
    history: { list },
    config,
    words,
    lobby,
    navigation: { setStep, setConfigTab },
  } = useGame();

  const baseKeys = (words.baseCategoryOptions || []).map((c) => c.key);

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
            !baseKeys.includes(entry.wordCategory) &&
            !(words.customCategories || {})[entry.wordCategory];
          return (
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
                    {missingCustom && (
                      <span style={{ color: '#f87171', display: 'block' }}>
                        Categoría personalizada no disponible
                      </span>
                    )}
                  </div>
                )}
                <span className="muted small">
                  {format(entry.timestamp, 'PPpp', { locale: es })}
                </span>
              </div>
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
                Usar
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
