import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LobbyPanel from "../../src/features/lobby/lobby-panel";

let mockLobby;
let mockNavigation;

vi.mock("../../src/contexts/game-state-context", () => ({
  useGame: () => ({
    navigation: mockNavigation,
    lobby: mockLobby,
  }),
}));

describe("LobbyPanel", () => {
  beforeEach(() => {
    mockNavigation = { setStep: vi.fn() };
    mockLobby = {
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
      setSecretWord: vi.fn(),
      toggleEliminated: vi.fn(),
      impostorCount: 1,
      impostorsAlive: 1,
      alliesAlive: 1,
      eliminated: [],
    };
  });

  it("muestra jugadores y permite iniciar partida", () => {
    render(<LobbyPanel />);
    expect(screen.getByText("Jugar partida")).toBeInTheDocument();
    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.getByText("Luis")).toBeInTheDocument();
    const startBtn = screen.getByText("Iniciar partida");
    expect(startBtn).toBeEnabled();
    fireEvent.click(startBtn);
  });

  it("deshabilita iniciar si no hay jugadores", () => {
    mockLobby.cleanNames = [];
    mockLobby.canStart = false;
    render(<LobbyPanel />);
    const startBtn = screen.getByText("Iniciar partida");
    expect(startBtn).toBeDisabled();
  });

  it("muestra confirmación de victoria y banner tras confirmar", () => {
    mockLobby.started = true;
    mockLobby.allRevealed = true;
    mockLobby.impostorsAlive = 0;
    mockLobby.alliesAlive = 2;
    render(<LobbyPanel />);
    // primer paso: panel de confirmación
    expect(screen.getByText(/¿Terminar la partida/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Finalizar partida/i));
    // ahora banner
    expect(screen.getByText(/Resultado/i)).toBeInTheDocument();
    expect(screen.getByText(/Confirmar finalización de la partida/i)).toBeInTheDocument();
  });
});
