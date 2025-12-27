import useGameConfigState from "./game/use-game-config-state";
import useGameDerived from "./game/use-game-derived";
import useGamePersistence from "./game/use-game-persistence";
import useGameLogic from "./game/use-game-logic";

function useGameState() {
  const config = useGameConfigState();
  const derived = useGameDerived({
    names: config.names,
    impostors: config.impostors,
    randomImpostors: config.randomImpostors,
    customCategories: config.customCategories,
    extraWords: config.extraWords,
  });

  const persistence = useGamePersistence({
    names: config.names,
    impostors: config.impostors,
    randomImpostors: config.randomImpostors,
    wordCategory: config.wordCategory,
    customCategories: config.customCategories,
    extraWords: config.extraWords,
    setNames: config.setNames,
    setImpostors: config.setImpostors,
    setRandomImpostors: config.setRandomImpostors,
    setWordCategory: config.setWordCategory,
    setCustomCategories: config.setCustomCategories,
    setExtraWords: config.setExtraWords,
    setConfigTab: config.setConfigTab,
    setStep: config.setStep,
  });

  const logic = useGameLogic({
    names: config.names,
    cleanNames: derived.cleanNames,
    baseLabels: derived.baseLabels,
    categoryLabels: derived.categoryLabels,
    wordCategory: config.wordCategory,
    availableCategories: derived.availableCategories,
    allWords: derived.allWords,
    maxImpostors: derived.maxImpostors,
    safeImpostors: derived.safeImpostors,
    canStart: derived.canStart,
    randomImpostors: config.randomImpostors,
    customCategories: config.customCategories,
    extraWords: config.extraWords,
    setHistory: persistence.setHistory,
    history: persistence.history,
    setRoles: undefined,
    setRevealIndex: undefined,
    setRevealed: undefined,
    setAllRevealed: undefined,
    setSecretWord: undefined,
    setStarted: undefined,
  });

  return {
    navigation: {
      step: config.step,
      setStep: config.setStep,
      configTab: config.configTab,
      setConfigTab: config.setConfigTab,
    },
    config: {
      impostors: config.impostors,
      names: config.names,
      maxImpostors: derived.maxImpostors,
      safeImpostors: derived.safeImpostors,
      randomImpostors: config.randomImpostors,
      setRandomImpostors: config.setRandomImpostors,
      setNames: config.setNames,
      setImpostors: config.setImpostors,
      handleNameChange: (index, value) =>
        config.setNames((prev) => prev.map((name, i) => (i === index ? value : name))),
      addNameField: () => config.setNames((prev) => [...prev, ""]),
      removeNameField: (index) => config.setNames((prev) => prev.filter((_, i) => i !== index)),
      loadLastConfig: persistence.loadLastConfig,
      hasSavedConfig: persistence.hasSavedConfig,
      canStart: derived.canStart,
    },
    words: {
      baseLabels: derived.baseLabels,
      baseWordCounts: derived.baseWordCounts,
      baseCategoryOptions: derived.baseCategoryOptions,
      customCategoryOptions: derived.customCategoryOptions,
      customCategories: config.customCategories,
      extraWords: config.extraWords,
      setCustomCategories: config.setCustomCategories,
      setExtraWords: config.setExtraWords,
      wordCategory: config.wordCategory,
      setWordCategory: config.setWordCategory,
      categoryLabels: derived.categoryLabels,
    },
    lobby: {
      started: logic.started,
      canStart: derived.canStart,
      cleanNames: derived.cleanNames,
      roles: logic.roles,
      impostorCount: logic.impostorCount,
      impostorsAlive: logic.impostorsAlive,
      alliesAlive: logic.alliesAlive,
      eliminated: logic.eliminated,
      revealed: logic.revealed,
      allRevealed: logic.allRevealed,
      secretWord: logic.secretWord,
      currentPlayer: logic.currentPlayer,
      selectedCategory: derived.categoryLabels[config.wordCategory] || config.wordCategory,
      startGame: logic.startGame,
      setStep: config.setStep,
      setRevealed: logic.setRevealed,
      setRevealIndex: logic.setRevealIndex,
      setAllRevealed: logic.setAllRevealed,
      setStarted: logic.setStarted,
      resetRound: logic.resetRound,
      setSecretWord: logic.setSecretWord,
      toggleEliminated: logic.toggleEliminated,
    },
    history: {
      list: persistence.history,
      setList: persistence.setHistory,
    },
    transfer: {
      customCategories: config.customCategories,
      extraWords: config.extraWords,
      importError: config.importError,
      setImportError: config.setImportError,
      setCustomCategories: config.setCustomCategories,
      setExtraWords: config.setExtraWords,
    },
    stats: {
      totalGames: logic.totalGames,
      todayGames: logic.todayGames,
      monthGames: logic.monthGames,
      monthLabel: logic.monthLabel,
    },
  };
}

export default useGameState;
