import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import QueueDisplay from "../pages/QueueDisplay";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/display" element={<QueueDisplay />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;