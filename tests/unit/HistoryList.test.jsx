import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import HistoryList from "../../src/components/HistoryList";

vi.mock("../../src/contexts/GameStateContext", () => {
  return {
    useGame: () => mockGame,
  };
});

let mockGame;

describe("HistoryList", () => {
  beforeEach(() => {
    mockGame = {
      history: {
        list: [
          {
            timestamp: 1,
            players: ["A", "B"],
            impostors: 1,
            randomImpostors: false,
            wordCategory: "missing-custom",
            wordCategoryLabel: "Missing",
          },
          {
            timestamp: 2,
            players: ["C", "D"],
            impostors: 1,
            randomImpostors: false,
            wordCategory: "basicas",
            word: "hola",
          },
        ],
      },
      words: {
        baseCategoryOptions: [{ key: "basicas" }],
        customCategories: {},
        setWordCategory: vi.fn(),
        setCustomCategories: vi.fn(),
        setExtraWords: vi.fn(),
      },
      config: {
        setNames: vi.fn(),
        setImpostors: vi.fn(),
        setRandomImpostors: vi.fn(),
      },
      lobby: { setSecretWord: vi.fn() },
      navigation: { setStep: vi.fn(), setConfigTab: vi.fn() },
    };
  });

  it("deshabilita 'Usar' cuando falta la categoría personalizada", () => {
    render(<HistoryList />);
    const disabledBtn = screen.getAllByText("Usar")[0];
    expect(disabledBtn).toBeDisabled();
    expect(screen.getByText(/no disponible/i)).toBeInTheDocument();
  });

  it("permite usar una entrada válida y navega a config game", () => {
    render(<HistoryList />);
    const enabledBtn = screen.getAllByText("Usar")[1];
    fireEvent.click(enabledBtn);
    expect(mockGame.config.setNames).toHaveBeenCalledWith(["C", "D"]);
    expect(mockGame.navigation.setConfigTab).toHaveBeenCalledWith("game");
    expect(mockGame.navigation.setStep).toHaveBeenCalledWith("config");
  });
});
