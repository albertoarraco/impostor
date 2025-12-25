import { useGame } from "../contexts/GameStateContext";

function HomePanel() {
  const {
    stats: { totalGames, todayGames, monthGames, monthLabel },
  } = useGame();

  return (
    <>
      <section className="panel">
        <h2>Bienvenida</h2>
        <p>
          Necesitamos un mínimo de jugadores y definir cuántos impostores habrá. Pasa a Configuración
          para agregar nombres y ajustar el número.
        </p>
        <div className="grid">
          <article>
            <h3>Cómo jugar</h3>
            <p>Agrega todos los nombres. Define 1 o más impostores. Inicia partida.</p>
          </article>
          <article>
            <h3>Roles</h3>
            <p>El sistema asignará impostores al iniciar. Comparte la info con cada jugador.</p>
          </article>
          <article>
            <h3>Revela en orden</h3>
            <p>Cuando estés listo, puedes revelar roles o avanzar a la vista de lobby.</p>
          </article>
        </div>
      </section>

      <section className="panel">
        <h2>Estadísticas</h2>
        <div className="grid stats-grid">
          <article className="stat-card">
            <small className="muted">Partidas totales</small>
            <h3 className="stat-number">{totalGames}</h3>
          </article>
          <article className="stat-card">
            <small className="muted">Partidas jugadas en {monthLabel}</small>
            <h3 className="stat-number">{monthGames}</h3>
          </article>
          <article className="stat-card">
            <small className="muted">Partidas jugadas hoy</small>
            <h3 className="stat-number">{todayGames}</h3>
          </article>
        </div>
      </section>
    </>
  );
}

export default HomePanel;
