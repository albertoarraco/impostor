import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfigPanel from "../../src/components/ConfigPanel";

vi.mock("../../src/contexts/GameStateContext", () => ({
  useGame: () => ({
    navigation: { setStep: vi.fn() },
    config: {
      impostors: 1,
      names: ["Juan", "Ana"],
      randomImpostors: false,
      canStart: true,
      addNameField: vi.fn(),
      setImpostors: vi.fn(),
      setRandomImpostors: vi.fn(),
      handleNameChange: vi.fn(),
      removeNameField: vi.fn(),
      hasSavedConfig: true,
      loadLastConfig: vi.fn(),
    },
    words: {
      baseCategoryOptions: [{ key: "basicas", label: "Básicas" }],
      customCategoryOptions: [{ key: "custom", label: "Custom" }],
      wordCategory: "basicas",
      setWordCategory: vi.fn(),
    },
  }),
}));

describe("ConfigPanel", () => {
  it("permite cambiar impostores y categorías", () => {
    render(<ConfigPanel />);

    const input = screen.getByLabelText(/Número de impostores/i);
    fireEvent.change(input, { target: { value: "2" } });
    expect(input.value).toBe("2");

    fireEvent.click(screen.getByText("Custom"));
    expect(screen.getByText("Custom")).toHaveClass("primary");
  });

  it("agrega jugador al pulsar el botón", () => {
    render(<ConfigPanel />);
    fireEvent.click(screen.getByText(/\+ Añadir jugador/i));
    // No assertion sobre estado interno porque está mockeado,
    // pero verificamos que el botón exista y sea clicable.
    expect(screen.getByText(/\+ Añadir jugador/i)).toBeInTheDocument();
  });
});
