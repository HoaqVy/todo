import { Routes, Route } from "react-router-dom";

import Upcoming from "./pages/Upcoming";
import Today from "./pages/Today";
import Calendar from "./pages/Calendar";
import StickyWall from "./pages/StickyWall";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/upcoming" element={<Upcoming />} />
      <Route path="/today" element={<Today />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/sticky-wall" element={<StickyWall />} />
    </Routes>
  );
}

export default App;
