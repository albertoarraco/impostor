import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { act } from "react";
import useGameLogic from "../../src/hooks/game/use-game-logic";
import storageKeys from "../../src/constants/storage-keys";

function HookProbe({ args, onValue }) {
  const state = useGameLogic(args);
  onValue(state);
  return null;
}

describe("useGameLogic", () => {
  const baseArgs = {
    names: ["Ana", "Luis"],
    cleanNames: ["Ana", "Luis"],
    baseLabels: {},
    categoryLabels: { basicas: "Básicas" },
    wordCategory: "basicas",
    availableCategories: { basicas: ["casa", "perro"] },
    allWords: ["casa", "perro"],
    maxImpostors: 2,
    safeImpostors: 1,
    canStart: true,
    randomImpostors: false,
    customCategories: {},
    extraWords: {},
    setHistory: vi.fn((updater) => updater([])),
    history: [],
  };

  let randomSpy;
  let originalStorage;
  let snapshot;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2023-01-01T12:00:00Z"));
    // Mock localStorage
    originalStorage = global.localStorage;
    const store = new Map();
    global.localStorage = {
      getItem: (k) => store.get(k) || null,
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
      clear: () => store.clear(),
    };
    snapshot = null;
    randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);
  });

  afterEach(() => {
    randomSpy?.mockRestore();
    vi.useRealTimers();
    global.localStorage = originalStorage;
  });

  it("asigna roles, palabra secreta y persiste en historial al iniciar partida", () => {
    render(<HookProbe args={baseArgs} onValue={(v) => (snapshot = v)} />);
    act(() => snapshot.startGame());
    expect(snapshot.roles).toHaveLength(2);
    expect(snapshot.secretWord).toBeTruthy();
    expect(snapshot.revealIndex).toBe(0);
    expect(snapshot.revealed).toBe(false);
    expect(snapshot.allRevealed).toBe(false);
    expect(snapshot.started).toBe(true);
    const storedHistory = JSON.parse(localStorage.getItem(storageKeys.history) || "[]");
    expect(storedHistory[0]).toMatchObject({
      players: ["Ana", "Luis"],
      impostors: 1,
      wordCategory: "basicas",
    });
  });

  it("resetRound limpia estado de partida", () => {
    render(<HookProbe args={baseArgs} onValue={(v) => (snapshot = v)} />);
    act(() => snapshot.startGame());
    act(() => snapshot.resetRound());
    expect(snapshot.started).toBe(false);
    expect(snapshot.roles).toEqual([]);
    expect(snapshot.revealIndex).toBe(0);
    expect(snapshot.revealed).toBe(false);
    expect(snapshot.allRevealed).toBe(false);
    expect(snapshot.secretWord).toBe("");
  });

  it("calcula estadísticas de partidas", () => {
    const nowTs = Date.UTC(2023, 0, 15, 12, 0, 0); // mid-month to avoid boundaries
    vi.setSystemTime(new Date(nowTs));
    const history = [
      { timestamp: nowTs, players: ["Ana"], impostors: 1 },
      { timestamp: nowTs, players: ["Luis"], impostors: 1 },
    ];
    render(
      <HookProbe args={{ ...baseArgs, history, setHistory: vi.fn((v) => v(history)) }} onValue={(v) => (snapshot = v)} />
    );
    expect(snapshot.totalGames).toBe(2);
    expect(snapshot.todayGames).toBe(2);
    expect(snapshot.monthGames).toBe(2);
  });
});
