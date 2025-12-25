import { createContext, useContext } from "react";
import PropTypes from 'prop-types';
import useGameState from "../hooks/use-game-state";

const GameStateContext = createContext(null);

export function GameStateProvider({ children }) {
  const game = useGameState();
  return <GameStateContext.Provider value={game}>{children}</GameStateContext.Provider>;
}

GameStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useGame() {
  const ctx = useContext(GameStateContext);
  if (!ctx) throw new Error("useGame must be used within a GameStateProvider");
  return ctx;
}

export default GameStateProvider;
