function ConfigPanel({
  impostors,
  names,
  canStart,
  randomImpostors,
  categoryOptionsBase,
  categoryOptionsCustom,
  onImpostorsChange,
  onToggleRandom,
  onNameChange,
  onAddName,
  onRemoveName,
  wordCategory,
  onWordCategoryChange,
  onBack,
  onNext,
  onLoadLast,
  hasSavedConfig,
}) {
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
            max={Math.max(1, (names.filter((n) => n.trim()).length || 1) - 1)}
            value={Math.min(impostors, Math.max(1, (names.filter((n) => n.trim()).length || 1) - 1))}
            disabled={randomImpostors}
            onChange={(e) => onImpostorsChange(Number(e.target.value) || 1)}
          />
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={randomImpostors}
              onChange={(e) => onToggleRandom(e.target.checked)}
            />
            <span className="slider" aria-hidden="true" />
            <span className="toggle-label">Impostores aleatorios</span>
          </label>
        </div>
      </div>
     <div className="panel-separator" />
      <div className="field">
        <label>Categoría de palabra</label>
        <p className="muted small" style={{ marginTop: '4px' }}>Categorías base</p>
        <div className="category-group">
          {categoryOptionsBase.map((cat) => (
            <button
              key={cat.key}
              type="button"
              className={`btn category-btn ${wordCategory === cat.key ? 'primary' : ''}`}
              onClick={() => onWordCategoryChange(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {categoryOptionsCustom.length > 0 && (
          <>
            <p className="muted small" style={{ marginTop: '10px' }}>Categorías personalizadas</p>
            <div className="category-group">
              {categoryOptionsCustom.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  className={`btn category-btn ${wordCategory === cat.key ? 'primary' : ''}`}
                  onClick={() => onWordCategoryChange(cat.key)}
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
          <button className="btn" type="button" onClick={onAddName}>
            + Añadir jugador
          </button>
        </div>
        <div className="names-list">
          {names.map((name, index) => (
            <div key={index} className="name-row">
              <input
                type="text"
                placeholder={`Jugador ${index + 1}`}
                value={name}
                onChange={(e) => onNameChange(index, e.target.value)}
              />
              {names.length > 1 && (
                <button
                  className="icon-btn"
                  type="button"
                  aria-label="Eliminar"
                  onClick={() => onRemoveName(index)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="actions spaced">
        <button className="btn" type="button" onClick={onBack}>
          Volver
        </button>
        {hasSavedConfig && onLoadLast && (
          <button className="btn" type="button" onClick={onLoadLast}>
            Cargar última partida
          </button>
        )}
        <button
          className={`btn primary ${!canStart ? 'disabled' : ''}`}
          type="button"
          disabled={!canStart}
          onClick={onNext}
        >
          Guardar y continuar
        </button>
      </div>
      {!canStart && <p className="hint">Añade al menos tantos jugadores como impostores.</p>}
    </section>
  );
}

export default ConfigPanel;
