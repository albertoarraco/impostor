import { useCallback, useEffect, useState } from "react";
import storageKeys from "../../constants/storageKeys";

function useGamePersistence({
  names,
  impostors,
  randomImpostors,
  wordCategory,
  customCategories,
  extraWords,
  setNames,
  setImpostors,
  setRandomImpostors,
  setWordCategory,
  setCustomCategories,
  setExtraWords,
  setConfigTab,
  setStep,
}) {
  const [history, setHistory] = useState([]);
  const [hasSavedConfig, setHasSavedConfig] = useState(false);

  // hydrate
  useEffect(() => {
    try {
      const savedConfig = JSON.parse(localStorage.getItem(storageKeys.config) || "null");
      if (savedConfig?.names?.length) setNames(savedConfig.names);
      if (typeof savedConfig?.impostors === "number") setImpostors(savedConfig.impostors);
      if (typeof savedConfig?.randomImpostors === "boolean")
        setRandomImpostors(savedConfig.randomImpostors);
      if (savedConfig?.wordCategory) setWordCategory(savedConfig.wordCategory);
      if (savedConfig?.customCategories) setCustomCategories(savedConfig.customCategories);
      if (savedConfig?.extraWords) setExtraWords(savedConfig.extraWords);

      const savedHistory = JSON.parse(localStorage.getItem(storageKeys.history) || "[]");
      if (Array.isArray(savedHistory)) setHistory(savedHistory);
      if (
        savedConfig?.names?.length ||
        typeof savedConfig?.impostors === "number" ||
        (Array.isArray(savedHistory) && savedHistory.length > 0)
      ) {
        setHasSavedConfig(true);
      }
    } catch {
      /* ignore */
    }
  }, [setNames, setImpostors, setRandomImpostors, setWordCategory, setCustomCategories, setExtraWords]);

  // persist config
  useEffect(() => {
    const hasNames = names.some((n) => n.trim());
    if (!hasNames && impostors === 1 && !randomImpostors) return;
    const payload = {
      names,
      impostors,
      randomImpostors,
      wordCategory,
      customCategories,
      extraWords,
    };
    localStorage.setItem(storageKeys.config, JSON.stringify(payload));
    setHasSavedConfig(true);
  }, [names, impostors, randomImpostors, wordCategory, customCategories, extraWords]);

  const loadLastConfig = useCallback(() => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem(storageKeys.history) || "[]");
      const saved = JSON.parse(localStorage.getItem(storageKeys.config) || "null");
      const latest = Array.isArray(savedHistory) && savedHistory[0];
      const toUse =
        (latest &&
          (latest.players?.length || typeof latest.impostors === "number")) ||
        (saved && (saved.names?.length || typeof saved.impostors === "number"))
          ? latest || saved
          : null;

      if (!toUse) return;

      if (toUse.players?.length) setNames([...toUse.players]);
      else if (toUse.names?.length) setNames([...toUse.names]);
      if (typeof toUse.impostors === "number") setImpostors(toUse.impostors);
      setHasSavedConfig(true);
      setConfigTab("game");
      setStep?.("config");
    } catch {
      /* ignore */
    }
  }, [setNames, setImpostors, setConfigTab, setStep]);

  return {
    history,
    setHistory,
    hasSavedConfig,
    setHasSavedConfig,
    loadLastConfig,
  };
}

export default useGamePersistence;
