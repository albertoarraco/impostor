import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LobbyPanel from "../../src/components/LobbyPanel";

vi.mock("../../src/contexts/GameStateContext", () => ({
  useGame: () => ({
    navigation: { setStep: vi.fn() },
    lobby: {
      started: false,
      canStart: true,
      cleanNames: ["Ana", "Luis"],
      roles: [{ name: "Ana", role: "Ciudadano" }, { name: "Luis", role: "Impostor" }],
      revealIndex: 0,
      revealed: false,
      allRevealed: false,
      secretWord: "casa",
      currentPlayer: { name: "Ana", role: "Ciudadano" },
      selectedCategory: "basicas",
      startGame: vi.fn(),
      setRevealed: vi.fn(),
      setRevealIndex: vi.fn(),
      setAllRevealed: vi.fn(),
      resetRound: vi.fn(),
    },
  }),
}));

describe("LobbyPanel", () => {
  it("muestra jugadores y permite iniciar partida", () => {
    render(<LobbyPanel />);
    expect(screen.getByText("Jugar partida")).toBeInTheDocument();
    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.getByText("Luis")).toBeInTheDocument();
    const startBtn = screen.getByText("Iniciar partida");
    expect(startBtn).toBeEnabled();
    fireEvent.click(startBtn);
  });
});
