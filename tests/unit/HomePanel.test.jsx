import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePanel from "../../src/components/HomePanel";

vi.mock("../../src/contexts/GameStateContext", () => ({
  useGame: () => ({
    stats: { totalGames: 10, todayGames: 2, monthGames: 4, monthLabel: "enero" },
  }),
}));

describe("HomePanel", () => {
  it("muestra estadísticas desde el contexto", () => {
    render(<HomePanel />);
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText(/enero/i)).toBeInTheDocument();
  });
});
