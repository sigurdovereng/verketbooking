import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../components/LoginPage";
import Dashboard from "../pages/Dashboard";
import QueueDisplay from "../pages/QueueDisplay";

function App() {
  const [auth, setAuth] = useState(
    () => sessionStorage.getItem("auth") || null
  );

  function handleLogin(encoded) {
    sessionStorage.setItem("auth", encoded);
    setAuth(encoded);
  }

  function handleLogout() {
    sessionStorage.removeItem("auth");
    setAuth(null);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            auth ? (
              <Dashboard
                authHeader={`Basic ${auth}`}
                onLogout={handleLogout}
              />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        <Route path="/display" element={<QueueDisplay />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
