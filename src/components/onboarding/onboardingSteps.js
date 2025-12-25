const onboardingSteps = [
  {
    title: "Inicio rápido",
    body: "Comienza en Inicio para ver estadísticas y luego ve a Configuración.",
    cta: "Ir a Configuración",
    targetStep: "config",
    targetConfigTab: "game",
  },
  {
    title: "Configura la partida",
    body: "Añade nombres, define impostores y elige categoría de palabras.",
    cta: "Ir a Palabras",
    targetStep: "config",
    targetConfigTab: "words",
  },
  {
    title: "Gestiona palabras",
    body: "Usa la pestaña Palabras para ver, agregar o importar listas.",
    cta: "Volver a Configuración",
    targetStep: "config",
    targetConfigTab: "game",
  },
  {
    title: "Juega en el lobby",
    body: "Arranca la partida y revela roles jugador por jugador.",
    cta: "Ir a Lobby",
    targetStep: "lobby",
  },
  {
    title: "Consulta el historial",
    body: "Revisa partidas previas y vuelve a cargarlas.",
    cta: "Ver historial",
    targetStep: "history",
  },
  {
    title: "Comparte configuraciones",
    body: "Exporta o importa listas desde la pestaña Compartir.",
    cta: "Ir a Compartir",
    targetStep: "config",
    targetConfigTab: "transfer",
  },
];

export default onboardingSteps;
