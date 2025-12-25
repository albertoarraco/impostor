import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TransferPanel from "../../src/components/TransferPanel";

let setImportError;
let setCustomCategories;
let setExtraWords;

vi.mock("../../src/contexts/GameStateContext", () => ({
  useGame: () => ({
    transfer: {
      customCategories: { Perso: ["a"] },
      extraWords: { basicas: ["extra"] },
      importError: "",
      setImportError,
      setCustomCategories,
      setExtraWords,
    },
  }),
}));

describe("TransferPanel", () => {
  beforeEach(() => {
    setImportError = vi.fn();
    setCustomCategories = vi.fn();
    setExtraWords = vi.fn();
    vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
  });

  it("exporta a portapapeles sin lanzar error", async () => {
    render(<TransferPanel />);
    const exportBtn = screen.getByText(/Exportar a JSON/i);
    fireEvent.click(exportBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  it("muestra error si el JSON es inválido al importar", () => {
    render(<TransferPanel />);
    const textarea = screen.getByPlaceholderText(/Pega aquí un JSON/i);
    fireEvent.change(textarea, { target: { value: "no-json" } });
    fireEvent.click(screen.getByText(/Importar JSON/i));
    expect(setImportError).toHaveBeenCalledWith("JSON inválido. Revisa el formato.");
  });
});
