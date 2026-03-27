import { useState } from "react";
import "../styles/modal.css";

const DURATIONS = [
  { label: "30 min", minutes: 30 },
  { label: "1 time", minutes: 60 },
  { label: "1,5 time", minutes: 90 },
  { label: "2 timer", minutes: 120 },
];

export default function AddReservationModal({ games, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gameId, setGameId] = useState(games[0]?.id || "");
  const [startTime, setStartTime] = useState("");
  const [durationMin, setDurationMin] = useState(60);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const today = new Date().toISOString().split("T")[0];
      const startedAt = new Date(`${today}T${startTime}`);
      const endsAt = new Date(startedAt.getTime() + durationMin * 60 * 1000);
      await onSubmit({
        name,
        phoneNumber: phone,
        gameId: Number(gameId),
        startedAt: startedAt.toISOString(),
        endsAt: endsAt.toISOString(),
      });
    } catch (err) {
      setError(err.message || "Tidspunktet er allerede opptatt for dette bordet.");
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Ny reservasjon</h2>
        <form onSubmit={handleSubmit}>
          <label>Bord</label>
          <select value={gameId} onChange={(e) => setGameId(e.target.value)}>
            {games.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

          <label>Navn</label>
          <input
            placeholder="Fullt navn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          <label>Telefon</label>
          <input
            placeholder="+47 000 00 000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <label>Starttidspunkt</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />

          <label>Varighet</label>
          <div className="duration-pills">
            {DURATIONS.map((d) => (
              <button
                key={d.minutes}
                type="button"
                className={`duration-pill${durationMin === d.minutes ? " selected" : ""}`}
                onClick={() => setDurationMin(d.minutes)}
              >
                {d.label}
              </button>
            ))}
          </div>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-buttons">
            <button type="submit">Legg til</button>
            <button type="button" onClick={onClose}>Avbryt</button>
          </div>
        </form>
      </div>
    </div>
  );
}
