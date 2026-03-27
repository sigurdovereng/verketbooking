import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./components/LoginPage";

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

  if (!auth) return <LoginPage onLogin={handleLogin} />;
  return <Dashboard authHeader={`Basic ${auth}`} onLogout={handleLogout} />;
}

export default App;
