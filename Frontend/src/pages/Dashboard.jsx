import { useState } from "react";
import GameCard from "../components/GameCard";
import "../styles/dashboard.css";

export default function Dashboard() {

  // midlertidig mock data for spill, skal senere hentes fra backend
  const [games] = useState([
    { id: 1, name: "Shuffle 1", status: "ledig" },
    { id: 2, name: "Shuffle 2", status: "opptatt" },
    { id: 3, name: "Shuffle 3", status: "opptatt" },
    { id: 4, name: "Biljard", status: "opptatt" },
    { id: 5, name: "Dart 1", status: "ledig" },
    { id: 6, name: "Dart 2", status: "ledig" }
  ]);

  return (
    <div className="dashboard-container">

      <div className="dashboard-header">
        <h1 className="logo">VERKET INDUSTRIBAR</h1>

        {/* pluss knapp (skal brukes senere til å redigere aktiviteter) */}
        <button className="add-button">+</button>
      </div>

      <div className="games-grid">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

    </div>
  );
}