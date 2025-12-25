import { useMemo, useState } from 'react';
import { useGame } from "../contexts/GameStateContext";

function WordsPanel() {
  const { words } = useGame();
  const {
    baseLabels: baseCategories,
    baseWordCounts,
    baseCategoryOptions,
    customCategories,
    extraWords,
    setCustomCategories,
    setExtraWords,
    setWordCategory,
  } = words;
  const [newCatName, setNewCatName] = useState('');
  const [newCatWords, setNewCatWords] = useState('');
  const baseOnly = useMemo(() => baseCategoryOptions.filter((c) => c.key !== 'random'), [baseCategoryOptions]);
  const [selectedCat, setSelectedCat] = useState(baseOnly[0]?.key || 'basicas');
  const [extraList, setExtraList] = useState('');
  const [editCat, setEditCat] = useState(null);
  const [editWords, setEditWords] = useState('');
  const [baseEditCat, setBaseEditCat] = useState(null);
  const [baseEditText, setBaseEditText] = useState('');

  const allCustom = useMemo(() => Object.entries(customCategories || {}), [customCategories]);
  const currentExtras = useMemo(() => extraWords[selectedCat] || [], [extraWords, selectedCat]);

  return (
    <section className="panel">
      <h2>Palabras</h2>
      <p className="muted">Gestiona categorías personalizadas o añade palabras extra a cualquier categoría.</p>
      <div className="panel-separator" />
      <div className="field">
        <label>Palabras extra en categorías base</label>
        <div className="names-list">
          {baseOnly.map((cat) => {
            const extraCount = extraWords[cat.key]?.length || 0;
            return (
              <div
                key={cat.key}
                className={`history-entry ${baseEditCat === cat.key ? 'active' : ''} column`}
                style={{ padding: '10px' }}
              >
                <div className="history-meta-row">
                  <div className="history-meta">
                    <strong>{cat.label}</strong>
                    <span className="muted small">
                      Base: {baseWordCounts?.[cat.key] || 0} · Extras: {extraCount}
                    </span>
                  </div>
                  <div className="actions" style={{ gap: '6px' }}>
                    <button
                      className="btn"
                      type="button"
                      onClick={() => {
                        setBaseEditCat(cat.key);
                        setBaseEditText((extraWords[cat.key] || []).join(', '));
                      }}
                    >
                      Editar
                    </button>
                  </div>
                </div>
                {baseEditCat === cat.key && (
                  <div className="edit-inline" style={{ marginTop: '8px' }}>
                    <textarea
                      rows={3}
                      placeholder="Palabras extra separadas por coma"
                      value={baseEditText}
                      onChange={(e) => setBaseEditText(e.target.value)}
                    />
                    <div className="actions spaced">
                      <button
                        className="btn primary"
                        type="button"
                        onClick={() => {
                          const words = baseEditText
                            .split(',')
                            .map((w) => w.trim())
                            .filter(Boolean);
                          setExtraWords((prev) => ({ ...prev, [cat.key]: words }));
                          setBaseEditCat(null);
                          setBaseEditText('');
                        }}
                      >
                        Guardar extras
                      </button>
                      <button
                        className="btn"
                        type="button"
                        onClick={() => {
                          setBaseEditCat(null);
                          setBaseEditText('');
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="panel-separator" />
      {allCustom.length > 0 && (
        <div className="field">
          <label>Categorías personalizadas</label>
          <div className="names-list">
            {allCustom.map(([name, words]) => (
              <div
                key={name}
                className={`history-entry ${editCat === name ? 'active' : ''} column`}
                style={{ padding: '10px' }}
              >
                <div className="history-meta-row">
                  <div className="history-meta">
                    <strong>{name}</strong>
                    <span className="muted small">{words.length} palabras</span>
                    {words.length > 0 && (
                      <div className="muted small words-preview">
                        {words.slice(0, 6).join(', ')}
                        {words.length > 6 ? '…' : ''}
                      </div>
                    )}
                  </div>
                  <div className="actions" style={{ gap: '6px' }}>
                    <button
                      className="btn"
                      type="button"
                      onClick={() => {
                        setEditCat(name);
                        setEditWords(words.join(', '));
                      }}
                    >
                      Editar
                    </button>
                    <button className="btn" type="button" onClick={() => {
                      setCustomCategories((prev) => {
                        const next = { ...prev };
                        delete next[name];
                        return next;
                      });
                      if (words.wordCategory === name) setWordCategory("basicas");
                    }}>
                      Eliminar
                    </button>
                  </div>
                </div>
                {editCat === name && (
                  <div className="edit-inline" style={{ marginTop: '8px' }}>
                    <textarea
                      rows={3}
                      value={editWords}
                      onChange={(e) => setEditWords(e.target.value)}
                    />
                    <div className="actions spaced">
                      <button
                        className="btn primary"
                        type="button"
                        onClick={() => {
                          const words = editWords
                            .split(',')
                            .map((w) => w.trim())
                            .filter(Boolean);
                          setCustomCategories((prev) => ({ ...prev, [editCat]: words }));
                          setEditCat(null);
                          setEditWords('');
                        }}
                      >
                        Guardar cambios
                      </button>
                      <button
                        className="btn"
                        type="button"
                        onClick={() => {
                          setEditCat(null);
                          setEditWords('');
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="field">
        <label>Nueva categoría personalizada</label>
        <input
          type="text"
          placeholder="Nombre de la categoría"
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value.trim())}
        />
        <textarea
          rows={4}
          placeholder="Palabras separadas por coma"
          value={newCatWords}
          onChange={(e) => setNewCatWords(e.target.value)}
        />
        <div className="actions spaced">
          <button
            className="btn primary"
            type="button"
            onClick={() => {
              if (!newCatName || !newCatWords) return;
              const words = newCatWords
                .split(',')
                .map((w) => w.trim())
                .filter(Boolean);
              setCustomCategories((prev) => ({ ...prev, [newCatName]: words }));
              setNewCatName('');
              setNewCatWords('');
            }}
          >
            Guardar categoría
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => {
              setNewCatName('');
              setNewCatWords('');
            }}
          >
            Limpiar
          </button>
        </div>
      </div>
    </section>
  );
}

export default WordsPanel;
