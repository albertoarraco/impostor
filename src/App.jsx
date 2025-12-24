import { useEffect, useMemo, useState } from 'react';
import { format, isSameMonth, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import HeaderNav, { steps } from './components/HeaderNav';
import HomePanel from './components/HomePanel';
import ConfigPanel from './components/ConfigPanel';
import LobbyPanel from './components/LobbyPanel';
import HistoryList from './components/HistoryList';
import WordsPanel from './components/WordsPanel';
import TransferPanel from './components/TransferPanel';
import categories from './data/words';
import './App.css';

const STORAGE_KEYS = {
  config: 'imp-config',
  history: 'imp-history',
};

function App() {
  const [step, setStep] = useState('home');
  const [names, setNames] = useState(['']);
  const [impostors, setImpostors] = useState(1);
  const [roles, setRoles] = useState([]);
  const [revealIndex, setRevealIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [allRevealed, setAllRevealed] = useState(false);
  const [started, setStarted] = useState(false);
  const [history, setHistory] = useState([]);
  const [hasSavedConfig, setHasSavedConfig] = useState(false);
  const [randomImpostors, setRandomImpostors] = useState(false);
  const [wordCategory, setWordCategory] = useState('basicas');
  const [customCategories, setCustomCategories] = useState({});
  const [extraWords, setExtraWords] = useState({});
  const [secretWord, setSecretWord] = useState('');
  const [importError, setImportError] = useState('');
  const [configTab, setConfigTab] = useState('game'); // game | words | transfer
  // pageview por pestaña
  useEffect(() => {
    if (typeof window === 'undefined' || !window.gtag) return;
    const page =
      step === 'config'
        ? `/config/${configTab}`
        : step === 'lobby'
          ? '/jugar'
          : `/${step}`;
    window.gtag('event', 'page_view', {
      page_path: page,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [step, configTab]);
  const availableCategories = useMemo(() => {
    const merged = { ...categories };
    Object.entries(customCategories).forEach(([key, words]) => {
      merged[key] = words || [];
    });
    // aplica extras sobre cualquier categoría (incluyendo custom)
    Object.entries(extraWords).forEach(([key, words]) => {
      merged[key] = [...(merged[key] || []), ...(words || [])];
    });
    return merged;
  }, [customCategories, extraWords]);

  const baseLabels = {
    basicas: 'Básicas',
    viajes: 'Viajes',
    comida: 'Comida',
    tecnologia: 'Tecnología',
    acciones: 'Acciones',
    series: 'Series y pelis',
  };

  const categoryLabels = useMemo(() => {
    const custom = Object.keys(customCategories).reduce((acc, key) => {
      acc[key] = key;
      return acc;
    }, {});
    return { ...baseLabels, ...custom };
  }, [baseLabels, customCategories]);

  const baseWordCounts = useMemo(
    () => Object.fromEntries(Object.entries(categories).map(([k, v]) => [k, v.length || 0])),
    [],
  );

  const baseCategoryOptions = useMemo(() => {
    const baseKeys = Object.keys(categories);
    const options = baseKeys.map((key) => ({
      key,
      label: baseLabels[key] || key,
    }));
    options.push({ key: 'random', label: 'Aleatorio' });
    return options;
  }, []);

  const customCategoryOptions = useMemo(() => {
    const customKeys = Object.keys(customCategories);
    return customKeys.map((key) => ({
      key,
      label: baseLabels[key] || key,
    }));
  }, [baseLabels, customCategories]);

  const allWords = useMemo(() => Object.values(availableCategories).flat(), [availableCategories]);
  const loadLastConfig = () => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.history) || '[]');
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.config) || 'null');
      const latest = Array.isArray(savedHistory) && savedHistory[0];
      const toUse =
        (latest && (latest.players?.length || typeof latest.impostors === 'number')) ||
        (saved && (saved.names?.length || typeof saved.impostors === 'number'))
          ? latest || saved
          : null;

      if (!toUse) return;

      if (toUse.players?.length) {
        setNames([...toUse.players]);
      } else if (toUse.names?.length) {
        setNames([...toUse.names]);
      }
      if (typeof toUse.impostors === 'number') {
        setImpostors(toUse.impostors);
      }
      setStarted(false);
      setRoles([]);
      setRevealIndex(0);
      setRevealed(false);
      setAllRevealed(false);
      setHasSavedConfig(true);
      setStep('config');
    } catch (e) {
      // ignore parse errors
    }
  };

  const cleanNames = useMemo(
    () => names.map((n) => n.trim()).filter((n) => n.length > 0),
    [names],
  );
  const maxImpostors = Math.max(1, cleanNames.length - 1);
  const safeImpostors = Math.min(impostors, maxImpostors);
  const canStart = useMemo(() => cleanNames.length > 1 && safeImpostors > 0, [cleanNames, safeImpostors]);

  useEffect(() => {
    try {
      const savedConfig = JSON.parse(localStorage.getItem(STORAGE_KEYS.config) || 'null');
      if (savedConfig?.names?.length) {
        setNames(savedConfig.names);
      }
      if (typeof savedConfig?.impostors === 'number') {
        setImpostors(savedConfig.impostors);
      }
      if (typeof savedConfig?.randomImpostors === 'boolean') {
        setRandomImpostors(savedConfig.randomImpostors);
      }
      if (savedConfig?.wordCategory) {
        setWordCategory(savedConfig.wordCategory);
      }
      if (savedConfig?.customCategories) {
        setCustomCategories(savedConfig.customCategories);
      }
      if (savedConfig?.extraWords) {
        setExtraWords(savedConfig.extraWords);
      }
      const savedHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.history) || '[]');
      if (Array.isArray(savedHistory)) {
        setHistory(savedHistory);
      }
      if (
        (savedConfig?.names?.length || typeof savedConfig?.impostors === 'number') ||
        (Array.isArray(savedHistory) && savedHistory.length > 0)
      ) {
        setHasSavedConfig(true);
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    const hasNames = names.some((n) => n.trim());
    if (!hasNames && impostors === 1 && !randomImpostors) return; // evita guardar config vacía por defecto
    const payload = {
      names,
      impostors,
      randomImpostors,
      wordCategory,
      customCategories,
      extraWords,
    };
    localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(payload));
    setHasSavedConfig(true);
  }, [names, impostors, randomImpostors, wordCategory, customCategories, extraWords]);

  const handleNameChange = (index, value) => {
    setNames((prev) => prev.map((name, i) => (i === index ? value : name)));
  };

  const addNameField = () => setNames((prev) => [...prev, '']);

  const removeNameField = (index) => {
    setNames((prev) => prev.filter((_, i) => i !== index));
  };

  const startGame = () => {
    if (!canStart) return;
    const impostorCount = randomImpostors
      ? Math.floor(Math.random() * maxImpostors) + 1
      : safeImpostors;

    const sourceWords =
      wordCategory === 'random'
        ? allWords
        : availableCategories[wordCategory]?.length
          ? availableCategories[wordCategory]
          : categories.basicas;
    const randomWord = sourceWords[Math.floor(Math.random() * sourceWords.length)];

    const shuffled = [...cleanNames].sort(() => Math.random() - 0.5);
    const impostorSet = new Set(shuffled.slice(0, impostorCount));
    const assigned = cleanNames.map((name) => ({
      name,
      role: impostorSet.has(name) ? 'Impostor' : randomWord || 'Tripulante',
    }));
    // GA: evento de partida iniciada
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'game_start', {
        players: cleanNames.length,
        impostors: impostorCount,
        category: categoryLabels[wordCategory] || wordCategory,
        total_games: history.length + 1,
      });
    }
    setRoles(assigned);
    setRevealIndex(0);
    setRevealed(false);
    setAllRevealed(false);
    setSecretWord(randomWord || '');
    setHistory((prev) => {
      const next = [
        {
          timestamp: Date.now(),
          players: cleanNames,
          impostors: impostorCount,
          randomImpostors,
          word: randomWord || '',
          wordCategory,
          wordCategoryLabel: categoryLabels[wordCategory] || wordCategory,
          customCategories,
          extraWords,
        },
        ...prev,
      ];
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(next));
      return next;
    });
    setHasSavedConfig(true);
  };

  const currentPlayer = roles[revealIndex];
  const totalGames = history.length;
  const todayGames = history.filter((h) => isToday(new Date(h.timestamp))).length;
  const monthGames = history.filter((h) => isSameMonth(new Date(h.timestamp), new Date())).length;
  const monthLabel = format(new Date(), 'LLLL', { locale: es });

  return (
    <div className="page">
      <header className="hero">
        <div className="pill">Juego de impostor</div>
        <h1>El impostor</h1>
        <p>Define jugadores, número de impostores y arranca la partida.</p>
        <HeaderNav step={step} onStepChange={setStep} />
      </header>

      {step === 'home' && (
        <HomePanel
          totalGames={totalGames}
          todayGames={todayGames}
          monthGames={monthGames}
          monthLabel={monthLabel}
        />
      )}

      {step === 'config' && (
        <section className="panel">
          <div className="actions" style={{ gap: '8px', flexWrap: 'wrap' }}>
            <button
              className={`btn ${configTab === 'game' ? 'primary' : ''}`}
              type="button"
              onClick={() => setConfigTab('game')}
            >
              Configuración del juego
            </button>
            <button
              className={`btn ${configTab === 'words' ? 'primary' : ''}`}
              type="button"
              onClick={() => setConfigTab('words')}
            >
              Palabras
            </button>
            <button
              className={`btn ${configTab === 'transfer' ? 'primary' : ''}`}
              type="button"
              onClick={() => setConfigTab('transfer')}
            >
              Compartir
            </button>
          </div>

          <div style={{ marginTop: '16px' }}>
            {configTab === 'game' && (
              <ConfigPanel
                impostors={impostors}
                names={names}
                canStart={canStart}
                randomImpostors={randomImpostors}
                onImpostorsChange={setImpostors}
                onToggleRandom={setRandomImpostors}
                categoryOptionsBase={baseCategoryOptions}
                categoryOptionsCustom={customCategoryOptions}
                onNameChange={handleNameChange}
                onAddName={addNameField}
                onRemoveName={removeNameField}
                wordCategory={wordCategory}
                onWordCategoryChange={setWordCategory}
                onBack={() => setStep('home')}
                onNext={() => setStep('lobby')}
                onLoadLast={loadLastConfig}
                hasSavedConfig={hasSavedConfig}
              />
            )}

            {configTab === 'words' && (
              <WordsPanel
                baseCategories={baseLabels}
                baseWordCounts={baseWordCounts}
                baseCategoryOptions={baseCategoryOptions}
                customCategories={customCategories}
                extraWords={extraWords}
                onSaveCustom={(name, words) => {
                  setCustomCategories((prev) => ({ ...prev, [name]: words }));
                }}
                onDeleteCustom={(name) => {
                  setCustomCategories((prev) => {
                    const next = { ...prev };
                    delete next[name];
                    return next;
                  });
                  if (wordCategory === name) setWordCategory('basicas');
                }}
                onSaveExtra={(cat, words) => {
                  setExtraWords((prev) => ({ ...prev, [cat]: words }));
                }}
              />
            )}

            {configTab === 'transfer' && (
              <TransferPanel
                customCategories={customCategories}
                extraWords={extraWords}
                error={importError}
                onClearError={() => setImportError('')}
                onImport={(payload, err) => {
                  if (err) {
                    setImportError(err);
                    return;
                  }
                  try {
                    if (!payload || typeof payload !== 'object') throw new Error('Payload vacío');
                    const { customCategories: c = {}, extraWords: e = {} } = payload;
                    if (c && typeof c === 'object') setCustomCategories(c);
                    if (e && typeof e === 'object') setExtraWords(e);
                    setImportError('');
                  } catch (e2) {
                    setImportError('JSON inválido o incompleto.');
                  }
                }}
              />
            )}
          </div>
        </section>
      )}

      {step === 'lobby' && (
        <LobbyPanel
          started={started}
          canStart={canStart}
          cleanNames={cleanNames}
          roles={roles}
          revealed={revealed}
          allRevealed={allRevealed}
          secretWord={secretWord}
          currentPlayer={currentPlayer}
          selectedCategory={categoryLabels[wordCategory] || wordCategory}
          onStartGame={startGame}
          onConfig={() => setStep('config')}
          onReveal={() => setRevealed(true)}
          onNext={() => {
            setRevealed(false);
            if (revealIndex >= roles.length - 1) {
              setAllRevealed(true);
            } else {
              setRevealIndex((i) => i + 1);
            }
          }}
          onRestart={() => {
            setStarted(false);
            setRoles([]);
            setRevealIndex(0);
            setRevealed(false);
            setAllRevealed(false);
            setSecretWord('');
          }}
        />
      )}

      {step === 'history' && (
        <HistoryList
          history={history}
          onSelect={(entry) => {
            setNames(entry.players);
            setImpostors(entry.impostors);
            setRandomImpostors(Boolean(entry.randomImpostors));
            if (entry.wordCategory) setWordCategory(entry.wordCategory);
            if (entry.customCategories) setCustomCategories(entry.customCategories);
            if (entry.extraWords) setExtraWords(entry.extraWords);
            if (entry.word) setSecretWord(entry.word);
            setStep('config');
          }}
        />
      )}

      {step === 'palabras' && (
        <WordsPanel
          baseCategories={baseLabels}
          baseWordCounts={baseWordCounts}
          baseCategoryOptions={baseCategoryOptions}
          customCategories={customCategories}
          extraWords={extraWords}
          onSaveCustom={(name, words) => {
            setCustomCategories((prev) => ({ ...prev, [name]: words }));
          }}
          onDeleteCustom={(name) => {
            setCustomCategories((prev) => {
              const next = { ...prev };
              delete next[name];
              return next;
            });
            if (wordCategory === name) setWordCategory('basicas');
          }}
          onSaveExtra={(cat, words) => {
            setExtraWords((prev) => ({ ...prev, [cat]: words }));
          }}
        />
      )}

      {step === 'transfer' && (
        <TransferPanel
          customCategories={customCategories}
          extraWords={extraWords}
          error={importError}
          onClearError={() => setImportError('')}
          onImport={(payload, err) => {
            if (err) {
              setImportError(err);
              return;
            }
            try {
              if (!payload || typeof payload !== 'object') throw new Error('Payload vacío');
              const { customCategories: c = {}, extraWords: e = {} } = payload;
              if (c && typeof c === 'object') setCustomCategories(c);
              if (e && typeof e === 'object') setExtraWords(e);
              setImportError('');
            } catch (e2) {
              setImportError('JSON inválido o incompleto.');
            }
          }}
        />
      )}
    </div>
  );
}

export default App;
