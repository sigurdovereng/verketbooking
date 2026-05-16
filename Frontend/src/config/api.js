const LOCAL_API_BASE = "http://localhost:8080/api";
const RENDER_API_BASE = "https://vaerketbooking.onrender.com/api";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

export const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (LOCAL_HOSTS.has(window.location.hostname) ? LOCAL_API_BASE : RENDER_API_BASE);
