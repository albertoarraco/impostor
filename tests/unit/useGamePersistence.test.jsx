import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import useGamePersistence from "../../src/hooks/game/useGamePersistence";
import storageKeys from "../../src/constants/storageKeys";

function HookProbe({ args, onValue }) {
  const state = useGamePersistence(args);
  onValue(state);
  return null;
}

describe("useGamePersistence", () => {
  const setters = {
    setNames: vi.fn(),
    setImpostors: vi.fn(),
    setRandomImpostors: vi.fn(),
    setWordCategory: vi.fn(),
    setCustomCategories: vi.fn(),
    setExtraWords: vi.fn(),
    setConfigTab: vi.fn(),
    setStep: vi.fn(),
  };

  let originalStorage;

  beforeEach(() => {
    originalStorage = global.localStorage;
    const store = new Map();
    global.localStorage = {
      getItem: (k) => store.get(k) || null,
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
      clear: () => store.clear(),
    };
    Object.values(setters).forEach((fn) => fn.mockClear());
  });

  afterEach(() => {
    global.localStorage = originalStorage;
  });

  it("hidrata config y history desde localStorage", () => {
    localStorage.setItem(
      storageKeys.config,
      JSON.stringify({
        names: ["Ana"],
        impostors: 2,
        randomImpostors: true,
        wordCategory: "basicas",
        customCategories: { C1: ["a"] },
        extraWords: { basicas: ["x"] },
      })
    );
    localStorage.setItem(storageKeys.history, JSON.stringify([{ timestamp: 1 }]));

    let snapshot = null;
    render(
      <HookProbe
        args={{
          names: [""],
          impostors: 1,
          randomImpostors: false,
          wordCategory: "basicas",
          customCategories: {},
          extraWords: {},
          ...setters,
        }}
        onValue={(v) => (snapshot = v)}
      />
    );

    expect(setters.setNames).toHaveBeenCalledWith(["Ana"]);
    expect(setters.setImpostors).toHaveBeenCalledWith(2);
    expect(setters.setRandomImpostors).toHaveBeenCalledWith(true);
    expect(setters.setWordCategory).toHaveBeenCalledWith("basicas");
    expect(snapshot.history).toEqual([{ timestamp: 1 }]);
    expect(snapshot.hasSavedConfig).toBe(true);
  });

  it("persiste config cuando hay datos válidos", () => {
    let snapshot = null;
    render(
      <HookProbe
        args={{
          names: ["Ana"],
          impostors: 2,
          randomImpostors: false,
          wordCategory: "basicas",
          customCategories: {},
          extraWords: {},
          ...setters,
        }}
        onValue={(v) => (snapshot = v)}
      />
    );
    const saved = JSON.parse(localStorage.getItem(storageKeys.config) || "{}");
    expect(saved.impostors).toBe(2);
    expect(snapshot.hasSavedConfig).toBe(true);
  });

  it("loadLastConfig restaura desde history y navega a config", () => {
    localStorage.setItem(
      storageKeys.history,
      JSON.stringify([{ players: ["Ana", "Luis"], impostors: 1 }])
    );
    localStorage.setItem(
      storageKeys.config,
      JSON.stringify({ names: ["X"], impostors: 2 })
    );

    let snapshot = null;
    render(
      <HookProbe
        args={{
          names: [""],
          impostors: 1,
          randomImpostors: false,
          wordCategory: "basicas",
          customCategories: {},
          extraWords: {},
          ...setters,
        }}
        onValue={(v) => (snapshot = v)}
      />
    );

    act(() => snapshot.loadLastConfig());
    expect(setters.setNames).toHaveBeenCalledWith(["Ana", "Luis"]);
    expect(setters.setImpostors).toHaveBeenCalledWith(1);
    expect(setters.setConfigTab).toHaveBeenCalledWith("game");
    expect(setters.setStep).toHaveBeenCalledWith("config");
    expect(snapshot.hasSavedConfig).toBe(true);
  });
});
