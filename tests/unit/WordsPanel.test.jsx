import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import WordsPanel from "../../src/components/WordsPanel";

let setCustomCategories;
let setExtraWords;
let setWordCategory;

vi.mock("../../src/contexts/GameStateContext", () => ({
  useGame: () => ({
    words: {
      baseLabels: ["Básicas"],
      baseWordCounts: { basicas: 3 },
      baseCategoryOptions: [
        { key: "basicas", label: "Básicas" },
        { key: "random", label: "Random" },
      ],
      customCategories: { Personal: ["uno", "dos"] },
      extraWords: { basicas: ["extra1"] },
      setCustomCategories,
      setExtraWords,
      setWordCategory,
      wordCategory: "basicas",
    },
  }),
}));

describe("WordsPanel", () => {
  beforeEach(() => {
    setCustomCategories = vi.fn((fn) => fn({}));
    setExtraWords = vi.fn((fn) => fn({ basicas: [] }));
    setWordCategory = vi.fn();
  });

  it("guarda extras en categoría base", () => {
    render(<WordsPanel />);
    const editButtons = screen.getAllByText("Editar");
    fireEvent.click(editButtons[0]); // base category edit
    const textarea = screen.getByPlaceholderText(/Palabras extra separadas/i);
    fireEvent.change(textarea, { target: { value: "uno, dos" } });
    fireEvent.click(screen.getByText("Guardar extras"));
    expect(setExtraWords).toHaveBeenCalled();
  });

  it("crea nueva categoría personalizada", () => {
    render(<WordsPanel />);
    fireEvent.change(screen.getByPlaceholderText(/Nombre de la categoría/i), {
      target: { value: "Nueva" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Palabras separadas por coma/i), {
      target: { value: "a,b,c" },
    });
    fireEvent.click(screen.getByText("Guardar categoría"));
    expect(setCustomCategories).toHaveBeenCalled();
  });

  it("elimina categoría personalizada existente", () => {
    render(<WordsPanel />);
    const deleteBtn = screen.getByText("Eliminar");
    fireEvent.click(deleteBtn);
    expect(setCustomCategories).toHaveBeenCalled();
  });
});
