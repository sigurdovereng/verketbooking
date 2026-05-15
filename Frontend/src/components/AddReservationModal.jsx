import { useEffect, useState } from "react";
import "../styles/modal.css";

const DURATIONS = [
  { label: "30 min", minutes: 30 },
  { label: "1 time", minutes: 60 },
  { label: "1,5 time", minutes: 90 },
  { label: "2 timer", minutes: 120 },
];

function pad(value) {
  return String(value).padStart(2, "0");
}

function getTodayDateString() {
  const today = new Date();
  return `${pad(today.getDate())}.${pad(today.getMonth() + 1)}.${today.getFullYear()}`;
}

function parseNorwegianDateTime(dateText, timeText) {
  const dateMatch = dateText.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  const timeMatch = timeText.match(/^([01]\d|2[0-3]):([0-5]\d)$/);

  if (!dateMatch) {
    throw new Error("Dato må skrives som dd.mm.åååå.");
  }

  if (!timeMatch) {
    throw new Error("Starttidspunkt må skrives som HH:MM i 24-timers format.");
  }

  const day = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const year = Number(dateMatch[3]);
  const hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);
  const date = new Date(year, month - 1, day, hours, minutes, 0, 0);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error("Datoen finnes ikke. Bruk dd.mm.åååå.");
  }

  return date;
}

export default function AddReservationModal({
  games,
  selectedGame,
  onClose,
  onSubmit,
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gameId, setGameId] = useState(selectedGame?.id || games[0]?.id || "");
  const [reservationDate, setReservationDate] = useState(getTodayDateString());
  const [startTime, setStartTime] = useState("");
  const [durationMin, setDurationMin] = useState(60);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedGame?.id) {
      setGameId(selectedGame.id);
    }
  }, [selectedGame]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      const startedAt = parseNorwegianDateTime(reservationDate, startTime);
      const endsAt = new Date(startedAt.getTime() + durationMin * 60 * 1000);

      await onSubmit({
        name,
        phoneNumber: phone,
        gameId: Number(gameId),
        startedAt: startedAt.toISOString(),
        endsAt: endsAt.toISOString(),
      });
    } catch (err) {
      setError(err.message || "Tidspunktet er allerede opptatt for dette spillet.");
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Ny reservasjon</h2>

        <form onSubmit={handleSubmit}>
          <label>Spill</label>
          <select
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            disabled={!!selectedGame}
          >
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
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

          <label>Dato</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="15.05.2026"
            pattern="[0-9]{2}\.[0-9]{2}\.[0-9]{4}"
            maxLength="10"
            title="Bruk norsk datoformat: dd.mm.åååå"
            value={reservationDate}
            onChange={(e) => setReservationDate(e.target.value)}
            required
          />

          <label>Starttidspunkt</label>
          <input
            type="time"
            lang="no-NO"
            step="300"
            title="Bruk 24-timers format: HH:MM"
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
            <button type="button" onClick={onClose}>
              Avbryt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
