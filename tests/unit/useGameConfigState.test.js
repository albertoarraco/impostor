import { describe, expect, it, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import useGameConfigState from "../../src/hooks/game/useGameConfigState";

function HookProbe({ onValue }) {
  const state = useGameConfigState();
  onValue(state);
  return null;
}

describe("useGameConfigState", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "http://localhost:5173/");
  });

  it("arranca en home si no hay step válido en la URL", () => {
    let snapshot = null;
    render(<HookProbe onValue={(v) => (snapshot = v)} />);
    expect(snapshot.step).toBe("home");
    expect(new URL(window.location.href).searchParams.get("step")).toBe("home");
  });

  it("inicializa step desde la URL si es permitido", () => {
    window.history.replaceState({}, "", "http://localhost:5173/?step=lobby");
    let snapshot = null;
    render(<HookProbe onValue={(v) => (snapshot = v)} />);
    expect(snapshot.step).toBe("lobby");
  });

  it("sincroniza cambios de step a la URL y limpia tab", () => {
    window.history.replaceState({}, "", "http://localhost:5173/?step=home&tab=words");
    let snapshot = null;
    render(<HookProbe onValue={(v) => (snapshot = v)} />);
    snapshot.setStep("history");
    const params = new URL(window.location.href).searchParams;
    expect(params.get("step")).toBe("history");
    expect(params.has("tab")).toBe(false);
  });
});
