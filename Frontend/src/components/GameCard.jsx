import "../styles/gamecard.css";

function formatTime(iso) {
  if (!iso) return "?";
  return new Date(iso).toLocaleTimeString("no-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getProgress(r) {
  const start = +new Date(r.startedAt);
  const end = +new Date(r.endsAt);
  const now = Date.now();
  return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
}

function getMinutesLeft(r) {
  return Math.max(0, Math.floor((+new Date(r.endsAt) - Date.now()) / 60000));
}

function getMinutesUntil(r) {
  return Math.max(0, Math.floor((+new Date(r.startedAt) - Date.now()) / 60000));
}

function formatTimeLeft(minutes) {
  if (minutes === 0) return "Slutter snart";
  if (minutes < 60) return `${minutes} min igjen`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}t ${m}m igjen` : `${h}t igjen`;
}

export default function GameCard({ game, isOccupied, currentPlayer, nextReservation, onClick }) {
  const endingSoon = isOccupied && currentPlayer && getMinutesLeft(currentPlayer) <= 15;
  const startingSoon = !isOccupied && nextReservation && getMinutesUntil(nextReservation) <= 15;

  let cardClass = "game-card ";
  if (isOccupied) cardClass += endingSoon ? "ending-soon" : "occupied";
  else cardClass += "available";

  let badge = null;
  if (isOccupied) {
    badge = endingSoon
      ? <span className="status-badge badge-snart">Slutter snart</span>
      : <span className="status-badge badge-opptatt">Opptatt</span>;
  } else {
    badge = startingSoon
      ? <span className="status-badge badge-snart">Starter snart</span>
      : <span className="status-badge badge-ledig">Ledig</span>;
  }

  return (
    <div className={cardClass} onClick={onClick}>
      <div className="card-stripe" />

      <div className="game-card-top">
        <h2 className="game-title">{game.name}</h2>
        {badge}
      </div>

      <div className="game-card-bottom">
        {isOccupied && currentPlayer ? (
          <>
            <p className="player-name">{currentPlayer.name}</p>
            <p className="player-time">
              {formatTime(currentPlayer.startedAt)} – {formatTime(currentPlayer.endsAt)}
            </p>
            <p className="time-remaining">{formatTimeLeft(getMinutesLeft(currentPlayer))}</p>
          </>
        ) : nextReservation ? (
          <>
            <p className="next-up-label">Neste opp</p>
            <p className="player-name">{nextReservation.name}</p>
            <p className="player-time">
              {formatTime(nextReservation.startedAt)} – {formatTime(nextReservation.endsAt)}
            </p>
          </>
        ) : (
          <p className="no-player">Ingen reservasjoner</p>
        )}
      </div>

      {isOccupied && currentPlayer && (
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${getProgress(currentPlayer)}%` }}
          />
        </div>
      )}
    </div>
  );
}
