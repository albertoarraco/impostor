import { test, expect } from "@playwright/test";

test("flujo completo home → config → lobby → history", async ({ page }) => {
  // Evitar onboarding bloqueando clicks
  await page.addInitScript(() =>
    window.localStorage.setItem("imp-onboarding-dismissed", "1")
  );

  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "El impostor" })
  ).toBeVisible();

  // Ir a configuración
  await page.getByRole("button", { name: "Configuración" }).click();

  // Añadir y rellenar jugadores
  await page.getByRole("button", { name: "+ Añadir jugador" }).click();
  const inputs = page.getByPlaceholder(/Jugador/);
  await inputs.nth(0).fill("Ana");
  await inputs.nth(1).fill("Luis");

  // Continuar al lobby
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await expect(
    page.getByRole("heading", { name: "Jugar partida" })
  ).toBeVisible();

  // Iniciar partida
  await page.getByRole("button", { name: "Iniciar partida" }).click();

  // Revelar jugadores
  await page.getByRole("button", { name: "Mostrar palabra" }).click();
  const nextButton = page.getByRole("button", {
    name: /Siguiente jugador|Empezar partida/,
  });
  await nextButton.click();
  // Segundo jugador
  const revealBtn2 = page.getByRole("button", { name: "Mostrar palabra" });
  if (await revealBtn2.isVisible()) {
    await revealBtn2.click();
    const endBtn = page.getByRole("button", {
      name: /Empezar partida|Siguiente jugador/,
    });
    await endBtn.click();
  }

  // Ir al historial
  await page.getByRole("button", { name: "Historial de partidas" }).click();
  await expect(
    page.getByRole("heading", { name: "Partidas recientes" })
  ).toBeVisible();
  await expect(page.getByText("Ana")).toBeVisible();
  await expect(page.getByText("Luis")).toBeVisible();
});
