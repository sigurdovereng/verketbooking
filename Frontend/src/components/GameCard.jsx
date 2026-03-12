import "../styles/gamecard.css";

export default function GameCard({ game }) {

  return (
    <div className="game-card">

      <h2 className="game-title">
        {game.name}
      </h2>

      {/* status */}
      <div
        className={
          game.status === "ledig"
            ? "game-status status-ledig"
            : "game-status status-opptatt"
        }
      >
        {game.status === "ledig" ? "Ledig" : "Opptatt"}
      </div>

    </div>
  );
}