import "../styles/gamedetail.css";

function formatTime(isoString) {
  if (!isoString) return "?";
  return new Date(isoString).toLocaleTimeString("no-NO", { hour: "2-digit", minute: "2-digit" });
}

export default function GameDetailModal({
  game,
  reservations,
  isOccupied,
  onClose,
  onDeleteReservation,
  onDeleteGame,
}) {
  const now = new Date();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="detail-header">
          <div>
            <h2 className="detail-title">{game.name}</h2>
            <span className={`status-badge ${isOccupied ? "badge-opptatt" : "badge-ledig"}`}>
              {isOccupied ? "Opptatt nå" : "Ledig nå"}
            </span>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="detail-body">
          <h3 className="reservations-heading">Reservasjoner i dag</h3>

          {reservations.length === 0 ? (
            <p className="no-reservations">Ingen reservasjoner</p>
          ) : (
            <ul className="reservation-list">
              {reservations.map((r) => {
                const isActive =
                  new Date(r.startedAt) <= now && new Date(r.endsAt) >= now;
                return (
                  <li key={r.id} className={`reservation-item ${isActive ? "active-now" : ""}`}>
                    <div className="reservation-info">
                      <span className="reservation-name">{r.name}</span>
                      <span className="reservation-phone">{r.phoneNumber}</span>
                      <span className="reservation-time">
                        {formatTime(r.startedAt)} – {formatTime(r.endsAt)}
                      </span>
                      {isActive && <span className="now-label">Nå</span>}
                    </div>
                    <button
                      className="delete-reservation-btn"
                      onClick={() => onDeleteReservation(r.id)}
                    >
                      Slett
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="detail-footer">
          <button className="delete-game-btn" onClick={onDeleteGame}>
            Slett bord
          </button>
        </div>
      </div>
    </div>
  );
}
