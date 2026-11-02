import { Routes, Route } from "react-router-dom";

import Today from "./pages/Today";
import StickyWall from "./pages/StickyWall";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import DashboardCreate from "./components/features/dashboard/DashboardCreate";
import Client from "./pages/Client";
import Layout from "./components/layout/Layout";
import CreateTask from "./components/features/task/CreateTask";
import EditTask from "./components/features/task/EditTask";
import Upcoming from "./pages/Upcoming";
import Calendar from "./pages/Calendar";
import Team from "./pages/Team";
import MyTasks from "./components/features/work-space";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/features/auth/ProtectedRoute";
import AdminRoute from "./components/features/auth/AdminRoute";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />


      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />} >

          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/create" element={<DashboardCreate />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/today" element={<Today />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route element={<AdminRoute />}>
            <Route path="/team" element={<Team />} />
            <Route path="/client" element={<Client />} />
          </Route>
          <Route path="/sticky-wall" element={<StickyWall />} />
          <Route path="/create-task" element={<CreateTask />} />
          <Route path="/dashboard/edit/:id" element={<EditTask />} />
          <Route path="/my-tasks" element={<MyTasks />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
