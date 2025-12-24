# Imp Web

Juego ligero tipo “impostor” para elegir palabra/rol, gestionar jugadores y compartir configuraciones de categorías.

## Requisitos

- Node 18+
- pnpm

## Arranque

```bash
pnpm install
pnpm start
```

Abre http://localhost:5173

## Flujo rápido

1. Inicio → ver stats.
2. Configuración → pestañas internas:
   - **Configuración del juego**: jugadores, impostores (fijo o aleatorio), categoría base/custom/aleatorio.
   - **Palabras**: gestionar categorías personalizadas y añadir extras a categorías base.
   - **Compartir**: exportar JSON (copia al portapapeles) e importar JSON para replicar categorías/extra words.
3. Jugar partida → muestra categoría elegida, revela palabra/rol por jugador.
4. Historial → reutiliza partidas (restaura categorías custom/extras).

## Categorías

- Base: básicas, viajes, comida, tecnología, acciones, series y pelis.
- Personalizadas: creadas en “Palabras” (se pueden editar/eliminar).
- Extras: palabras añadidas sobre categorías base desde “Palabras”.
- Opción **Aleatorio**: usa todas las palabras disponibles (base + custom + extras).

## Compartir (import/export)

- **Exportar**: genera JSON con `customCategories` y `extraWords`, intenta copiar al portapapeles y lo deja disponible en textarea.
- **Importar**: pega un JSON exportado y pulsa “Importar JSON”; crea/actualiza categorías personalizadas y extras. Muestra feedback de éxito o error.

Ejemplo de JSON:

```json
{
  "version": 1,
  "customCategories": {
    "mi-categoria": ["uno", "dos"]
  },
  "extraWords": {
    "basicas": ["extra1", "extra2"]
  }
}
```

## Persistencia

- Configuración e historial se guardan en `localStorage`.

## Scripts útiles

- `pnpm start` – dev server Vite.
- `pnpm build` – build producción.

## Notas

- Si el portapapeles está bloqueado, el JSON exportado queda en el textarea para copia manual.
- Al cargar desde historial se restauran categorías custom y extras usadas en esa partida.
