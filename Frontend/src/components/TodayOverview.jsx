import "../styles/todayoverview.css";

function formatTime(iso) {
  if (!iso) return "?";
  return new Date(iso).toLocaleTimeString("no-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TodayOverview({ reservations, onDeleteReservation }) {
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayRes = reservations
    .filter((r) => new Date(r.startedAt) >= today && new Date(r.startedAt) < tomorrow)
    .sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt));

  const isActive = (r) => new Date(r.startedAt) <= now && new Date(r.endsAt) >= now;
  const isPast = (r) => new Date(r.endsAt) < now;

  if (todayRes.length === 0) {
    return <div className="overview-empty">Ingen reservasjoner i dag.</div>;
  }

  return (
    <>
      <div className="overview-header">
        <span className="overview-title">Dagens program</span>
        <span className="overview-count">{todayRes.length} reservasjoner</span>
      </div>
      <div className="overview-list">
        {todayRes.map((r) => (
          <div
            key={r.id}
            className={`overview-item${isActive(r) ? " active" : isPast(r) ? " past" : ""}`}
          >
            <div className="overview-time">
              {formatTime(r.startedAt)} – {formatTime(r.endsAt)}
            </div>
            <div className="overview-info">
              <span className="overview-game">{r.game?.name}</span>
              <span className="overview-name">{r.name}</span>
              <span className="overview-phone">{r.phoneNumber}</span>
            </div>
            {isActive(r) && <span className="overview-badge">Pågår nå</span>}
            <button
              className="overview-delete"
              onClick={() => onDeleteReservation(r.id)}
              title="Slett reservasjon"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
