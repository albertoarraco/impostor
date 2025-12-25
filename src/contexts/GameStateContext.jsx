import { createContext, useContext } from "react";
import useGameState from "../hooks/useGameState";

const GameStateContext = createContext(null);

export function GameStateProvider({ children }) {
  const game = useGameState();
  return <GameStateContext.Provider value={game}>{children}</GameStateContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameStateContext);
  if (!ctx) throw new Error("useGame must be used within a GameStateProvider");
  return ctx;
}

export default GameStateContext;
