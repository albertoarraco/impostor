import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { render, waitFor, act } from "@testing-library/react";
import useGameConfigState from "../../src/hooks/game/use-game-config-state";

function HookProbe({ onValue }) {
  const state = useGameConfigState();
  onValue(state);
  return null;
}

describe("useGameConfigState", () => {
  let replaceSpy;

  beforeEach(() => {
    // Evita SecurityError en jsdom al cambiar origen
    replaceSpy = vi.spyOn(window.history, "replaceState").mockImplementation(() => {});
    window.history.pushState({}, "", "/");
  });

  afterEach(() => {
    replaceSpy.mockRestore();
  });

  it("arranca en home si no hay step válido en la URL", () => {
    let snapshot = null;
    act(() => {
      render(<HookProbe onValue={(v) => (snapshot = v)} />);
    });
    expect(snapshot.step).toBe("home");
    const url = new URL(replaceSpy.mock.calls.at(-1)?.[2] || window.location.href);
    expect(url.searchParams.get("step")).toBe("home");
  });

  it("inicializa step desde la URL si es permitido", () => {
    window.history.pushState({}, "", "/?step=lobby");
    let snapshot = null;
    act(() => {
      render(<HookProbe onValue={(v) => (snapshot = v)} />);
    });
    expect(snapshot.step).toBe("lobby");
  });

  it("sincroniza cambios de step a la URL y limpia tab", async () => {
    window.history.pushState({}, "", "/?step=home&tab=words");
    let snapshot = null;
    act(() => {
      render(<HookProbe onValue={(v) => (snapshot = v)} />);
    });
    await act(async () => {
      snapshot.setStep("history");
    });
    await waitFor(() => {
      const url = new URL(replaceSpy.mock.calls.at(-1)?.[2] || window.location.href);
      expect(url.searchParams.get("step")).toBe("history");
      expect(url.searchParams.has("tab")).toBe(false);
    });
  });
});
