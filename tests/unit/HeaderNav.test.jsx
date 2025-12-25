import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import HeaderNav from "../../src/components/HeaderNav";
import { render } from "@testing-library/react";

describe("HeaderNav", () => {
  it("resalta el paso activo y llama a onStepChange", () => {
    const onStepChange = vi.fn();
    render(<HeaderNav step="home" onStepChange={onStepChange} />);

    // botón activo
    expect(screen.getByText("Inicio")).toHaveClass("primary");

    // cambiar a "Historial de partidas"
    fireEvent.click(screen.getByText("Historial de partidas"));
    expect(onStepChange).toHaveBeenCalledWith("history");
  });
});
