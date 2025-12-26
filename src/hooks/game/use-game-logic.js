import { useCallback, useMemo, useState, useEffect } from "react";
import { format, isSameMonth, isToday } from "date-fns";
import { es } from "date-fns/locale";
import storageKeys from "../../constants/storage-keys";

function useGameLogic({
  names,
  cleanNames,
  baseLabels,
  categoryLabels,
  wordCategory,
  availableCategories,
  allWords,
  maxImpostors,
  safeImpostors,
  canStart,
  randomImpostors,
  customCategories,
  extraWords,
  setHistory,
  history,
  // optional external setters for sync (App no longer needs them but kept for flexibility)
  setRoles,
  setRevealIndex,
  setRevealed,
  setAllRevealed,
  setSecretWord,
  setStarted,
}) {
  const [roles, setRolesState] = useState([]);
  const [revealIndexState, setRevealIndexState] = useState(0);
  const [revealedState, setRevealedState] = useState(false);
  const [allRevealedState, setAllRevealedState] = useState(false);
  const [secretWordState, setSecretWordState] = useState("");
  const [startedState, setStartedState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // mirror to external setters when provided
  const updateRoles = useCallback(
    (val) => {
      setRolesState(val);
      setRoles?.(val);
    },
    [setRoles]
  );

  const updateRevealIndex = useCallback(
    (val) => {
      setRevealIndexState(val);
      setRevealIndex?.(val);
    },
    [setRevealIndex]
  );

  const updateRevealed = useCallback(
    (val) => {
      setRevealedState(val);
      setRevealed?.(val);
    },
    [setRevealed]
  );

  const updateAllRevealed = useCallback(
    (val) => {
      setAllRevealedState(val);
      setAllRevealed?.(val);
    },
    [setAllRevealed]
  );

  const updateSecretWord = useCallback(
    (val) => {
      setSecretWordState(val);
      setSecretWord?.(val);
    },
    [setSecretWord]
  );

  const updateStarted = useCallback(
    (val) => {
      setStartedState(val);
      setStarted?.(val);
    },
    [setStarted]
  );

  const startGame = useCallback(() => {
    if (!canStart) return;
    const impostorCount = randomImpostors
      ? Math.floor(Math.random() * maxImpostors) + 1
      : safeImpostors;

    const sourceWords =
      wordCategory === "random"
        ? allWords
        : availableCategories[wordCategory]?.length
        ? availableCategories[wordCategory]
        : [];

    const randomWord =
      sourceWords.length > 0
        ? sourceWords[Math.floor(Math.random() * sourceWords.length)]
        : "";

    const shuffled = [...cleanNames].sort(() => Math.random() - 0.5);
    const impostorSet = new Set(shuffled.slice(0, impostorCount));
    const assigned = cleanNames.map((name) => ({
      name,
      role: impostorSet.has(name) ? "Impostor" : randomWord || "Tripulante",
    }));

    updateRoles(assigned);
    updateRevealIndex(0);
    updateRevealed(false);
    updateAllRevealed(false);
    updateSecretWord(randomWord || "");
    setHistory((prev) => {
      const next = [
        {
          timestamp: Date.now(),
          players: cleanNames,
          impostors: impostorCount,
          randomImpostors,
          word: randomWord || "",
          wordCategory,
          wordCategoryLabel: categoryLabels[wordCategory] || wordCategory,
          customCategories,
          extraWords,
        },
        ...prev,
      ];
      localStorage.setItem(storageKeys.history, JSON.stringify(next));
      return next;
    });
    updateStarted(true);
  }, [
    allWords,
    availableCategories,
    canStart,
    categoryLabels,
    cleanNames,
    customCategories,
    extraWords,
    maxImpostors,
    randomImpostors,
    safeImpostors,
    setHistory,
    setStarted,
    updateAllRevealed,
    updateRevealIndex,
    updateRevealed,
    updateRoles,
    updateSecretWord,
    wordCategory,
  ]);

  const currentPlayer = roles[revealIndexState];
  const totalGames = history.length;
  const todayGames = history.filter((h) => isToday(new Date(h.timestamp))).length;
  const monthGames = history.filter((h) =>
    isSameMonth(new Date(h.timestamp), new Date())
  ).length;
  const monthLabel = format(new Date(), "LLLL", { locale: es });

  const resetRound = useCallback(() => {
    updateStarted(false);
    updateRoles([]);
    updateRevealIndex(0);
    updateRevealed(false);
    updateAllRevealed(false);
    updateSecretWord("");
    localStorage.removeItem(storageKeys.game);
  }, [updateAllRevealed, updateRevealIndex, updateRevealed, updateRoles, updateSecretWord, updateStarted]);

  // hydrate game state on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKeys.game) || "null");
      if (saved?.roles?.length) {
        updateRoles(saved.roles);
        const idx = Math.min(saved.roles.length - 1, Math.max(0, saved.revealIndex || 0));
        updateRevealIndex(idx);
        updateRevealed(!!saved.revealed);
        updateAllRevealed(!!saved.allRevealed);
        updateSecretWord(saved.secretWord || "");
        updateStarted(!!saved.started);
      }
    } catch {
      /* ignore */
    } finally {
      setHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist game state
  useEffect(() => {
    if (!hydrated) return;
    const hasRoles = roles.length > 0;
    if (!hasRoles && !startedState) {
      localStorage.removeItem(storageKeys.game);
      return;
    }
    const payload = {
      roles,
      revealIndex: revealIndexState,
      revealed: revealedState,
      allRevealed: allRevealedState,
      secretWord: secretWordState,
      started: startedState,
    };
    localStorage.setItem(storageKeys.game, JSON.stringify(payload));
  }, [
    roles,
    revealIndexState,
    revealedState,
    allRevealedState,
    secretWordState,
    startedState,
    hydrated,
  ]);

  return {
    roles,
    revealIndex: revealIndexState,
    revealed: revealedState,
    allRevealed: allRevealedState,
    secretWord: secretWordState,
    started: startedState,
    setStarted: updateStarted,
    setRoles: updateRoles,
    startGame,
    resetRound,
    setRevealIndex: updateRevealIndex,
    setRevealed: updateRevealed,
    setAllRevealed: updateAllRevealed,
    setSecretWord: updateSecretWord,
    currentPlayer,
    totalGames,
    todayGames,
    monthGames,
    monthLabel,
  };
}

export default useGameLogic;
