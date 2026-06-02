import { useState, useRef, useEffect } from "react";
import "../styles/gamedetail.css";

function formatTime(isoString) {
  if (!isoString) return "?";
  return new Date(isoString).toLocaleTimeString("no-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("no-NO", {
    day: "numeric",
    month: "short",
  });
}

export default function GameDetailModal({
  game,
  reservations,
  isOccupied,
  onClose,
  onDeleteReservation,
  onDeleteGame,
  onRenameGame,
  onAddReservation,
}) {
  const now = new Date();
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(game.name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setNameInput(game.name);
  }, [game.name]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function commitRename() {
    const trimmed = nameInput.trim();
    if (trimmed && trimmed !== game.name) {
      onRenameGame(trimmed);
    } else {
      setNameInput(game.name);
    }
    setEditing(false);
  }

  function handleNameKeyDown(e) {
    if (e.key === "Enter") commitRename();
    if (e.key === "Escape") { setNameInput(game.name); setEditing(false); }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="detail-header">
          <div className="detail-title-group">
            {editing ? (
              <input
                ref={inputRef}
                className="detail-title-input"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={commitRename}
                onKeyDown={handleNameKeyDown}
              />
            ) : (
              <h2 className="detail-title">
                {game.name}
                <button
                  className="rename-btn"
                  onClick={() => setEditing(true)}
                  title="Endre navn"
                >
                  ✎
                </button>
              </h2>
            )}
            <span className={`status-badge ${isOccupied ? "badge-opptatt" : "badge-ledig"}`}>
              {isOccupied ? "Opptatt nå" : "Ledig nå"}
            </span>
          </div>

          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="detail-body">
          <div className="detail-actions">
            <button className="add-reservation-btn" onClick={onAddReservation}>
              Legg til reservasjon
            </button>
          </div>

          <h3 className="reservations-heading">Reservasjoner</h3>

          {reservations.length === 0 ? (
            <p className="no-reservations">Ingen reservasjoner</p>
          ) : (
            <ul className="reservation-list">
              {reservations.map((r) => {
                const isActive =
                  new Date(r.startedAt) <= now && new Date(r.endsAt) >= now;

                return (
                  <li
                    key={r.id}
                    className={`reservation-item ${isActive ? "active-now" : ""}`}
                  >
                    <div className="reservation-info">
                      <span className="reservation-name">{r.name}</span>
                      <span className="reservation-phone">{r.phoneNumber}</span>
                      <span className="reservation-time">
                        <span className="reservation-date">{formatDate(r.startedAt)}</span>
                        {" "}{formatTime(r.startedAt)} – {formatTime(r.endsAt)}
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
          {confirmDelete ? (
            <div className="delete-confirm">
              <span className="delete-confirm-text">Er du sikker på at du vil slette spillet?</span>
              <div className="delete-confirm-actions">
                <button className="delete-confirm-yes" onClick={onDeleteGame}>
                  Ja, slett
                </button>
                <button className="delete-confirm-no" onClick={() => setConfirmDelete(false)}>
                  Avbryt
                </button>
              </div>
            </div>
          ) : (
            <button className="delete-game-btn" onClick={() => setConfirmDelete(true)}>
              Slett spill
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
