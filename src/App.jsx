import { Routes, Route } from "react-router-dom";

import Upcoming from "./pages/Upcoming";
import Today from "./pages/Today";
import Calendar from "./pages/Calendar";
import StickyWall from "./pages/StickyWall";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import DashboardCreate from "./components/features/dashboard/create";
import Team from "./pages/Team";
import Client from "./pages/Client";
import Layout from "./components/layout/Layout";
import CreateTask from "./pages/task/CreateTask";

function App() {
  return (
    <Routes>
      <Route element={<Layout />} >

        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/create" element={<DashboardCreate />} />
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/today" element={<Today />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/team" element={<Team />} />
        <Route path="/client" element={<Client />} />
        <Route path="/sticky-wall" element={<StickyWall />} />
        <Route path="/create-task" element={<CreateTask />} />
      </Route>
    </Routes>
  );
}

export default App;
