import { useState } from 'react';

function TransferPanel({
  customCategories,
  extraWords,
  onImport,
  error,
  onClearError,
}) {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [imported, setImported] = useState(false);

  const exportData = async () => {
    onClearError?.();
    setImported(false);
    const payload = {
      version: 1,
      customCategories,
      extraWords,
    };
    const json = JSON.stringify(payload, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 5000);
    } catch (e) {
      // si no hay permisos, mantenemos el texto en textarea
    }
  };

  const handleImport = () => {
    onClearError?.();
    setImported(false);
    try {
      const parsed = JSON.parse(text);
      onImport(parsed);
      setImported(true);
      setTimeout(() => setImported(false), 5000);
    } catch (e) {
      onImport(null, 'JSON inválido. Revisa el formato.');
    }
  };

  return (
    <section className="panel">
      <h2>Compartir configuración</h2>
      <p className="muted">Exporta o importa categorías personalizadas y palabras extra.</p>

      <div className="field">
        <label style={{marginTop: 10}}>Qué incluye</label>
        <ul className="muted" style={{ paddingLeft: '18px', lineHeight: 1.5, marginTop: 0 }}>
          <li>Categorías personalizadas con sus palabras.</li>
          <li>Palabras extra añadidas a categorías base (no sobrescribe las palabras base).</li>
        </ul>
      </div>

      <div className="field">
        <label>Exportar</label>
        <p className="muted small">Copia el JSON para compartir configuraciones</p>
        <div className="actions" style={{ gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn" type="button" onClick={exportData}>
            Exportar a JSON (copia)
          </button>
        </div>
        {copied && <span style={{ color: '#34d399', marginTop: '6px' }}>Copiado al portapapeles</span>}
      </div>


     <div className="panel-separator" />
      <div className="field">
        <label>Importar</label>
        <div className="field" style={{ marginTop: '12px' }}>
          <textarea
            id="transfer-json"
            rows={10}
            placeholder="Pega aquí un JSON exportado"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {error && (
            <p className="hint" style={{ color: '#f87171', marginTop: '6px' }}>
              {error}
            </p>
          )}
        </div>
        <div className="actions" style={{ gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn primary" type="button" onClick={handleImport}>
            Importar JSON
          </button>
        </div>
        {imported && !error && (
          <p className="hint" style={{ color: '#34d399', marginTop: '6px', marginBottom: '0' }}>
            Importado correctamente
          </p>
        )}
      </div>
    </section>
  );
}

export default TransferPanel;
