import { useState } from "react";
import { CircleCheck, CirclePlus, ClipboardList, Clock, Eraser, TriangleAlert } from "lucide-react";

import Search from "@/components/common/Search";
import Button from "@/components/common/Button";
import TaskItem from "@/pages/task/TaskItem";
import BoxSeaction from "@/components/common/BoxSection";
import DashboardCard from "@/pages/dashboard/DaskboardCard";
import { isOverdue } from "@/pages/task/TaskUtils";
import TaskOverview from "@/pages/task/TaskOverview";
import { useTasks } from "@/context/useTasks";


function DashboardFeature() {
  const {
    tasks = [],
    loading,
  } = useTasks();

  // FILTER STATE
  const [search, setSearch] = useState("")
  const [owner, setOwner] = useState("")
  const [status, setStatus] = useState("")
  const [priority, setPriority] = useState("")


  if (loading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading tasks...
        </p>
      </div>
    );
  }
  // FILTER OPTIONS

  const owners = [
    ...new Set(tasks.map((task) => task.owner).filter(Boolean))
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


  // FILTER TASKS
  const keyword = search.toLowerCase().trim();
  const filteredTasks = tasks.filter((task) => {

    const matchSearch =
      task.title?.toLowerCase().includes(keyword) ||
      task.owner?.toLowerCase().includes(keyword) ||
      task.status?.toLowerCase().includes(keyword) ||
      task.priority?.toLowerCase().includes(keyword) ||
      String(task.dueDate).includes(keyword);

    const matchOwner = !owner || task.owner === owner;
    const matchStatus = !status || task.status === status;
    const matchPriority = !priority || task.priority === priority;

    return (
      matchSearch &&
      matchOwner &&
      matchStatus &&
      matchPriority
    );
  });

  // DASHBOARD STATISTICS
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

  const completedPercentage =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  // Clear Filter
  const handleCleanFilter = () => {
    setSearch("");
    setOwner("");
    setStatus("");
    setPriority("")
  }
  // RENDER
  return (
    <div>
      <div >
        <div className="flex justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black">Dashboard</h1>
            <span>Overview of your tasks and productivity</span>
          </div>
          <Button href="/create-task" icon={CirclePlus} />
        </div>

        {/* Filter */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Search className="w-full " value={search} onChange={setSearch} />

          <div className="grid grid-cols-2 gap-4 sm:col-span-1 lg:col-span-4 lg:grid-cols-4">
            <BoxSeaction
              items={owners}
              value={owner}
              onValueChange={setOwner}
              placeholder="Owners"
              className="w-full"
            />

            <BoxSeaction
              items={statuses}
              value={status}
              onValueChange={setStatus}
              placeholder="Statuses"
              className="w-full"
            />

            <BoxSeaction
              items={priorities}
              value={priority}
              onValueChange={setPriority}
              placeholder="Priorities"
              className="w-full"
            />

            <button type="button" onClick={handleCleanFilter}
              className="flex h-10 w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
            >
              <Eraser size={18} />
            </button>
          </div>
        </div>

        {/* =========================
          DASHBOARD CARDS
      ========================= */}

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
            description={`${completedPercentage}% of total tasks`}
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

        {/* =========================
          OVERVIEW + RECENT TASKS
      ========================= */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TaskOverview tasks={filteredTasks} />
          <TaskItem tasks={filteredTasks} />
        </div>
      </div>
    </div>
  );
}
export default DashboardFeature;
