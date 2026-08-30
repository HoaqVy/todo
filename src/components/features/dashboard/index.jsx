import Search from "@/components/common/Search";
import Button from "@/components/common/Button";
import { CircleCheck, CirclePlus, ClipboardList, Clock, TriangleAlert } from "lucide-react";
import TaskOverview from "@/pages/Task/TaskOverview";
import TaskItem from "@/pages/task/TaskItem";
import { useState } from "react";
import BoxSeaction from "@/components/common/BoxSection";
import DashboardCard from "@/pages/dashboard/DaskboardCard";
import { isOverdue } from "@/pages/task/TaskUtils";


const owners = [
  "Hoang Vy",
  "Nguyen Van A",
  "Nguyen Van B",
];

const statuses = [
  "Todo",
  "In Progress",
  "Completed",
];

const priorities = [
  "Low",
  "Medium",
  "High",
];

const tasks = [
  {
    id: 1,
    title: "Design Homepage",
    owner: "Hoang Vy",
    status: "Completed",
    priority: "High",
    dueDate: "2026-09-02",
  },
  {
    id: 2,
    title: "Implement Login",
    owner: "Nguyen Van A",
    status: "In Progress",
    priority: "Medium",
    dueDate: "2026-08-30",

  },
  {
    id: 3,
    title: "Create Dashboard",
    owner: "Hoang Vy",
    status: "Todo",
    priority: "High",
    dueDate: "2026-09-15",

  },
  {
    id: 4,
    title: "Fix Responsive UI",
    owner: "Nguyen Van B",
    status: "Completed",
    priority: "Low",
    dueDate: "2026-02-11",

  },
  {
    id: 5,
    title: "Create API",
    owner: "Nguyen Van A",
    status: "Todo",
    priority: "Medium",
    dueDate: "2026-08-02",

  },
];

function DashboardFeature() {
  // Filter
  const [search, setSearch] = useState("")
  const [owner, setOwner] = useState("")
  const [status, setStatus] = useState("")
  const [priority, setPriority] = useState("")

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchOwner = !owner || task.owner === owner;
    const matchStatus = !status || task.status === status;
    const matchPriority = !priority || task.priority === priority;

    return (
      matchSearch && matchOwner && matchStatus && matchPriority
    )
  })

  // Dashboard statistics 
  const totalTasks = filteredTasks.length
  const completedTasks = filteredTasks.filter(
    (task) => task.status === "Completed"
  ).length
  const inProgressTasks = filteredTasks.filter(
    (task) => task.status === "In Progress"
  ).length
  const overdueTask = filteredTasks.filter(isOverdue).length;
  // console.log("TaskItem tasks:", tasks);
  // console.log("filteredTasks:", filteredTasks);
  return (
    <div>
      <div >
        <div className="flex justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black">Dashboard</h1>
            <span>Overview of your tasks and productivity</span>
          </div>
          <Button href="/dashboard/create" icon={CirclePlus} />
        </div>
        {/* Filter */}
        <div className="mt-6 flex flex-1 items-center justify-start">
          <Search className="w-60 mr-4 " value={search} onChange={setSearch} />

          <div className="flex gap-4">
            <BoxSeaction
              items={owners}
              value={owner}
              onValueChange={setOwner}
              placeholder="Owners"
              className="w-60"
            />

            <BoxSeaction
              items={statuses}
              value={status}
              onValueChange={setStatus}
              placeholder="Statuses"
              className="w-60"
            />

            <BoxSeaction
              items={priorities}
              value={priority}
              onValueChange={setPriority}
              placeholder="Priorities"
              className="w-60"
            />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Tasks"
            value={totalTasks}
            description="All tasks"
            icon={ClipboardList}
          />

          <DashboardCard
            title="Completed"
            value={completedTasks}
            description="50% of total tasks"
            icon={CircleCheck}
          />

          <DashboardCard
            title="In Progress"
            value={inProgressTasks}
            description="Currently working"
            icon={Clock}
          />

          <DashboardCard
            title="Overdue"
            value={overdueTask}
            description="Need attention"
            icon={TriangleAlert}
          />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TaskOverview tasks={filteredTasks} />
          <TaskItem tasks={filteredTasks} />
        </div>
      </div>
    </div>
  );
}
export default DashboardFeature;
