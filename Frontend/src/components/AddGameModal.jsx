import { useState } from "react";
import "../styles/modal.css";

export default function AddGameModal({ onClose, onSubmit }) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ name });
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Nytt bord</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Navn på bord (f.eks. Shuffle 1)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="modal-buttons">
            <button type="submit">Legg til</button>
            <button type="button" onClick={onClose}>Avbryt</button>
          </div>
        </form>
      </div>
    </div>
  );
}
