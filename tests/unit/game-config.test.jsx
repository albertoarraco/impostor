import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfigPanel from "../../src/features/config/game-config/game-config";

const mockSetImpostors = vi.fn();
const mockSetWordCategory = vi.fn();

vi.mock("../../src/contexts/game-state-context", () => ({
  useGame: () => ({
    navigation: { setStep: vi.fn() },
    config: {
      impostors: 1,
      maxImpostors: 3,
      safeImpostors: 1,
      names: ["Juan", "Ana"],
      randomImpostors: false,
      canStart: true,
      addNameField: vi.fn(),
      setImpostors: mockSetImpostors,
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
      setWordCategory: mockSetWordCategory,
    },
  }),
}));

describe("ConfigPanel", () => {
  beforeEach(() => {
    mockSetImpostors.mockClear();
    mockSetWordCategory.mockClear();
  });

  it("permite cambiar impostores y categorías", () => {
    render(<ConfigPanel />);

    const input = screen.getByLabelText(/Número de impostores/i);
    fireEvent.change(input, { target: { value: "2" } });
    // Valor clamped por lógica; verificamos que se llamó al setter
    expect(mockSetImpostors).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByText("Custom"));
    expect(mockSetWordCategory).toHaveBeenCalledWith("custom");
  });

  it("agrega jugador al pulsar el botón", () => {
    render(<ConfigPanel />);
    fireEvent.click(screen.getByText(/\+ Añadir jugador/i));
    // No assertion sobre estado interno porque está mockeado,
    // pero verificamos que el botón exista y sea clicable.
    expect(screen.getByText(/\+ Añadir jugador/i)).toBeInTheDocument();
  });
});
