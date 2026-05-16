import { useState, useEffect, useCallback } from "react";
import GameCard from "../components/GameCard";
import AddReservationModal from "../components/AddReservationModal";
import AddGameModal from "../components/AddGameModal";
import GameDetailModal from "../components/GameDetailModal";
import TodayOverview from "../components/TodayOverview";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import "../styles/dashboard.css";

const API_BASE = "http://localhost:8080/api";

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function Dashboard({ authHeader, onLogout }) {
  const HEADERS = {
    "Content-Type": "application/json",
    Authorization: authHeader,
  };

  const [games, setGames] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [modal, setModal] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [reservationGame, setReservationGame] = useState(null);
  const [view, setView] = useState("grid");
  const { toasts, toast } = useToast();
  const clock = useClock();

  const fetchGames = useCallback(() => {
    fetch(`${API_BASE}/games`, { headers: HEADERS })
      .then((r) => r.json())
      .then(setGames)
      .catch(() => {});
  }, [authHeader]);

  const fetchReservations = useCallback(() => {
    fetch(`${API_BASE}/reservations`, { headers: HEADERS })
      .then((r) => r.json())
      .then(setReservations)
      .catch(() => {});
  }, [authHeader]);

  useEffect(() => {
    fetchGames();
    fetchReservations();
    const id = setInterval(() => {
      fetchGames();
      fetchReservations();
    }, 30000);
    return () => clearInterval(id);
  }, [fetchGames, fetchReservations]);

  useEffect(() => {
    if (!reservations.length) return;
    const now = Date.now();
    const next = reservations
      .flatMap((r) => [+new Date(r.startedAt), +new Date(r.endsAt)])
      .filter((t) => t > now)
      .sort((a, b) => a - b)[0];

    if (!next) return;

    const delay = next - now + 500;
    const id = setTimeout(() => {
      fetchGames();
      fetchReservations();
    }, delay);

    return () => clearTimeout(id);
  }, [reservations, fetchGames, fetchReservations]);

  function handleAddGame(formData) {
    setModal(null);
    fetch(`${API_BASE}/games`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(formData),
    })
      .then(() => {
        fetchGames();
        toast(`${formData.name} er lagt til`, "success");
      })
      .catch(() => toast("Kunne ikke opprette spill", "error"));
  }

  function handleDeleteGame(gameId) {
    const game = games.find((g) => g.id === gameId);
    setGames((prev) => prev.filter((g) => g.id !== gameId));
    setSelectedGame(null);
    toast(`${game?.name ?? "Spillet"} er fjernet`, "info");
  }

  function handleRenameGame(gameId, newName) {
    setGames((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, name: newName } : g))
    );
    setSelectedGame((prev) =>
      prev?.id === gameId ? { ...prev, name: newName } : prev
    );
  }

  async function handleAddReservation(formData) {
    const res = await fetch(`${API_BASE}/reservations`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("Tidspunktet er allerede opptatt.");

    setModal(null);
    setReservationGame(null);
    fetchReservations();
    fetchGames();
    toast(`Reservasjon for ${formData.name} lagt til`, "success");
  }

  function handleDeleteReservation(reservationId) {
    const r = reservations.find((x) => x.id === reservationId);
    fetch(`${API_BASE}/reservations/${reservationId}`, {
      method: "DELETE",
      headers: HEADERS,
    })
      .then(() => {
        fetchReservations();
        fetchGames();
        toast(`Reservasjon for ${r?.name ?? "ukjent"} slettet`, "info");
      })
      .catch(() => toast("Kunne ikke slette reservasjon", "error"));
  }

  function isCurrentlyOccupied(gameId) {
    const now = new Date();
    return reservations.some(
      (r) =>
        r.game?.id === gameId &&
        new Date(r.startedAt) <= now &&
        new Date(r.endsAt) >= now
    );
  }

  function getCurrentReservation(gameId) {
    const now = new Date();
    return reservations.find(
      (r) =>
        r.game?.id === gameId &&
        new Date(r.startedAt) <= now &&
        new Date(r.endsAt) >= now
    );
  }

  function getNextReservation(gameId) {
    const now = new Date();
    return (
      reservations
        .filter((r) => r.game?.id === gameId && new Date(r.startedAt) > now)
        .sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt))[0] || null
    );
  }

  function getGameReservations(gameId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return reservations
      .filter((r) => r.game?.id === gameId && new Date(r.endsAt) >= today)
      .sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt));
  }

  function openGameDetails(game) {
    setSelectedGame(game);
  }

  function openAddReservationForGame(game) {
    setSelectedGame(null);
    setReservationGame(game);
    setModal("reservation");
  }

  const occupiedCount = games.filter((g) => isCurrentlyOccupied(g.id)).length;

  const clockStr = clock.toLocaleTimeString("no-NO", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const dateStr = clock.toLocaleDateString("no-NO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <img src="/Vrkettekstlogo.png" alt="Værket Industribar" className="logo-text-img" />
          <img src="/tannhjullogo.png" alt="" className="logo-gear-img" />
        </div>

        <div className="header-center">
          <span className="live-clock">{clockStr}</span>
          <span className="live-date">{dateStr}</span>
        </div>

        <div className="header-right">
          {games.length > 0 && (
            <div className="occupancy-stat">
              <span className="occ-count">
                {occupiedCount}/{games.length}
              </span>
              <span className="occ-label">spill opptatt</span>
            </div>
          )}

          <button
            className={`view-toggle${view === "list" ? " active" : ""}`}
            onClick={() => setView((v) => (v === "grid" ? "list" : "grid"))}
          >
            {view === "grid" ? "Dagoversikt" : "Spillvisning"}
          </button>

          <button className="logout-button" onClick={onLogout}>
            Logg ut
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="games-grid">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              isOccupied={isCurrentlyOccupied(game.id)}
              currentPlayer={getCurrentReservation(game.id)}
              nextReservation={getNextReservation(game.id)}
              onClick={() => openGameDetails(game)}
            />
          ))}

          <button
            type="button"
            className="add-game-card"
            onClick={() => setModal("game")}
          >
            <span className="add-game-plus">+</span>
            <span className="add-game-title">Legg til nytt spill</span>
            <span className="add-game-subtitle">
              Opprett nytt spill
            </span>
          </button>

          {games.length === 0 && (
            <p className="grid-empty">
              Ingen spill opprettet ennå. Trykk på boksen for å legge til det første.
            </p>
          )}
        </div>
      ) : (
        <TodayOverview
          reservations={reservations}
          onDeleteReservation={handleDeleteReservation}
        />
      )}

      {modal === "game" && (
        <AddGameModal onClose={() => setModal(null)} onSubmit={handleAddGame} />
      )}

      {modal === "reservation" && (
        <AddReservationModal
          games={games}
          selectedGame={reservationGame}
          onClose={() => {
            setModal(null);
            setReservationGame(null);
          }}
          onSubmit={handleAddReservation}
        />
      )}

      {selectedGame && (
        <GameDetailModal
          game={selectedGame}
          reservations={getGameReservations(selectedGame.id)}
          isOccupied={isCurrentlyOccupied(selectedGame.id)}
          onClose={() => setSelectedGame(null)}
          onDeleteReservation={handleDeleteReservation}
          onDeleteGame={() => handleDeleteGame(selectedGame.id)}
          onRenameGame={(newName) => handleRenameGame(selectedGame.id, newName)}
          onAddReservation={() => openAddReservationForGame(selectedGame)}
        />
      )}

      <Toast toasts={toasts} />
    </div>
  );
}