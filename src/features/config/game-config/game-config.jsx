import { useGame } from "../../../contexts/game-state-context";
import './game-config.css';

function ConfigPanel() {
  const {
    navigation: { setStep },
    config,
    words,
  } = useGame();

  const names = config.names;

  return (
    <section className="panel">
      <h2>Configuración del juego</h2>
      <div className="field">
        <label htmlFor="impostors">Número de impostores</label>
        <div className="impostor-row">
          <input
            id="impostors"
            type="number"
            min={1}
            max={config.maxImpostors || 1}
            value={config.impostors === "" ? "" : config.safeImpostors}
            disabled={config.randomImpostors}
            onChange={(e) => {
              const { value } = e.target;
              if (value === "") {
                config.setImpostors("");
                return;
              }
              const raw = Number(value);
              if (Number.isNaN(raw)) return;
              config.setImpostors(raw);
            }}
            onBlur={(e) => {
              const raw = Number(e.target.value);
              const clamped = Math.max(1, Math.min(config.maxImpostors || 1, Number.isNaN(raw) ? 1 : raw));
              config.setImpostors(clamped);
            }}
          />
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={config.randomImpostors}
              onChange={(e) => config.setRandomImpostors?.(e.target.checked)}
            />
            <span className="slider" aria-hidden="true" />
            <span className="toggle-label">Impostores aleatorios</span>
          </label>
        </div>
      </div>
     <div className="panel-separator" />
      <div className="field">
        <label htmlFor="word-category">Categoría de palabra</label>
        <p className="muted small" style={{ marginTop: '4px' }}>Categorías base</p>
        <div className="category-group" role="radiogroup" aria-labelledby="word-category">
          {words.baseCategoryOptions.map((cat) => (
            <button
              key={cat.key}
              type="button"
              className={`btn category-btn ${words.wordCategory === cat.key ? 'primary' : ''}`}
              onClick={() => words.setWordCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {words.customCategoryOptions.length > 0 && (
          <>
            <p className="muted small" style={{ marginTop: '10px' }}>Categorías personalizadas</p>
            <div className="category-group" role="radiogroup" aria-labelledby="word-category">
              {words.customCategoryOptions.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  className={`btn category-btn ${words.wordCategory === cat.key ? 'primary' : ''}`}
                  onClick={() => words.setWordCategory(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
     <div className="panel-separator" />
      <div className="names">
        <div className="names-header">
          <h3>Jugadores</h3>
          <button className="btn add-player" type="button" onClick={config.addNameField}>
            + Añadir jugador
          </button>
        </div>
        <div className="names-list">
          {names.map((name, index) => (
            <div key={`player-${index}`} className="name-row">
              <input
                type="text"
                placeholder={`Jugador ${index + 1}`}
                value={name}
                onChange={(e) => config.handleNameChange(index, e.target.value)}
              />
              {names.length > 1 && (
                <button
                  className="icon-btn"
                  type="button"
                  aria-label="Eliminar"
                  onClick={() => config.removeNameField(index)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="actions spaced">
        <button className="btn" type="button" onClick={() => setStep("home")}>
          Volver
        </button>
        {config.hasSavedConfig && config.loadLastConfig && (
          <button className="btn" type="button" onClick={config.loadLastConfig}>
            Cargar última partida
          </button>
        )}
        <button
          className={`btn primary ${config.canStart ? '' : 'disabled'}`}
          type="button"
          disabled={!config.canStart}
          onClick={() => setStep("lobby")}
        >
          Guardar y continuar
        </button>
      </div>
      {!config.canStart && <p className="hint">Añade al menos tantos jugadores como impostores.</p>}
    </section>
  );
}

export default ConfigPanel;
