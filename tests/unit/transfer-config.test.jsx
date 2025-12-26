import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import TransferPanel from "../../src/features/config/transfer-config/transfer-config";

let setImportError;
let setCustomCategories;
let setExtraWords;
let clipboardMock;

vi.mock("../../src/contexts/game-state-context", () => ({
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
    clipboardMock = { writeText: vi.fn().mockResolvedValue() };
    Object.defineProperty(global.navigator, "clipboard", {
      value: clipboardMock,
      writable: true,
    });
  });

  it("exporta a portapapeles sin lanzar error", async () => {
    await act(async () => {
      render(<TransferPanel />);
    });
    const exportBtn = screen.getByText(/Exportar a JSON/i);
    await act(async () => {
      fireEvent.click(exportBtn);
    });
    expect(clipboardMock.writeText).toHaveBeenCalled();
  });

  it("muestra error si el JSON es inválido al importar", () => {
    act(() => {
      render(<TransferPanel />);
    });
    const textarea = screen.getByPlaceholderText(/Pega aquí un JSON/i);
    fireEvent.change(textarea, { target: { value: "no-json" } });
    fireEvent.click(screen.getByText(/Importar JSON/i));
    expect(setImportError).toHaveBeenCalledWith("JSON inválido. Revisa el formato.");
  });
});
