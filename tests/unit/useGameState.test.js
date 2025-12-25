import { describe, it, expect, vi, beforeEach } from "vitest";
import useGameState from "../../src/hooks/useGameState";

vi.mock("../../src/hooks/game/useGameConfigState", () => {
  const state = {
    step: "home",
    configTab: "game",
    names: ["A"],
    impostors: 1,
    randomImpostors: false,
    wordCategory: "basicas",
    customCategories: {},
    extraWords: {},
    importError: "",
    setStep: vi.fn(),
    setConfigTab: vi.fn(),
    setNames: vi.fn(),
    setImpostors: vi.fn(),
    setRandomImpostors: vi.fn(),
    setWordCategory: vi.fn(),
    setCustomCategories: vi.fn(),
    setExtraWords: vi.fn(),
    setImportError: vi.fn(),
  };
  return { default: () => state };
});

vi.mock("../../src/hooks/game/useGameDerived", () => ({
  default: () => ({
    canStart: true,
    cleanNames: ["A"],
    baseLabels: [],
    baseWordCounts: {},
    baseCategoryOptions: [],
    customCategoryOptions: [],
    categoryLabels: {},
  }),
}));

vi.mock("../../src/hooks/game/useGamePersistence", () => ({
  default: () => ({
    history: [],
    setHistory: vi.fn(),
    loadLastConfig: vi.fn(),
    hasSavedConfig: false,
  }),
}));

vi.mock("../../src/hooks/game/useGameLogic", () => ({
  default: () => ({
    started: false,
    roles: [],
    revealed: false,
    allRevealed: false,
    secretWord: "",
    currentPlayer: null,
    startGame: vi.fn(),
    setRevealed: vi.fn(),
    setRevealIndex: vi.fn(),
    setAllRevealed: vi.fn(),
    setStarted: vi.fn(),
    resetRound: vi.fn(),
    revealIndex: 0,
    totalGames: 0,
    todayGames: 0,
    monthGames: 0,
    monthLabel: "mes",
    setSecretWord: vi.fn(),
  }),
}));

describe("useGameState", () => {
  it("compone y expone bloques de estado", () => {
    const state = useGameState();
    expect(state.navigation.step).toBe("home");
    expect(state.config.impostors).toBe(1);
    expect(state.words.extraWords).toEqual({});
    expect(state.lobby.started).toBe(false);
    expect(state.history.list).toEqual([]);
    expect(state.stats.monthLabel).toBe("mes");
  });
});
