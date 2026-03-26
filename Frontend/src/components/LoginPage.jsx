import { useState } from "react";
import "../styles/login.css";

const API_BASE = "http://localhost:8080/api";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const encoded = btoa(`${username}:${password}`);
    try {
      const res = await fetch(`${API_BASE}/games`, {
        headers: { Authorization: `Basic ${encoded}` },
      });
      if (res.ok) {
        onLogin(encoded);
      } else {
        setError("Feil brukernavn eller passord.");
      }
    } catch {
      setError("Kunne ikke koble til serveren.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-logo">VERKET</h1>
        <p className="login-subtitle">Industribar</p>
        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Brukernavn</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>
          <div className="login-field">
            <label>Passord</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logger inn..." : "Logg inn"}
          </button>
        </form>
      </div>
    </div>
  );
}
