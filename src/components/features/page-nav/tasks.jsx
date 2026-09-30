import { useTasks } from "@/context/useTasks";
import { LayoutList } from "lucide-react";
import {
  HiOutlineChevronDoubleRight,
  HiOutlineCalendar,
  HiOutlineClipboardList,
  HiOutlineDocument,
} from "react-icons/hi";
import { NavLink } from "react-router-dom";

const tasks = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutList,
  },
  {
    title: "Upcoming",
    path: "/upcoming",
    icon: HiOutlineChevronDoubleRight,
    type: "upcoming"
  },
  {
    title: "Today",
    path: "/today",
    icon: HiOutlineClipboardList,
    type: "today"
  },
  {
    title: "Calendar",
    path: "/calendar",
    icon: HiOutlineCalendar,
  },
  {
    title: "Sticky Wall",
    path: "/sticky-wall",
    icon: HiOutlineDocument,
  },
];

function Tasks({ onClose }) {
  const { tasks: allTasks = [] } = useTasks()

  const today = new Date()

  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )

  const tomorrowStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  const upcomingCount = allTasks.filter((task) => {
    if (!task.dueDate) return false;
    if (task.status === "Completed") return false;

    const dueDate = new Date(task.dueDate);

    return dueDate >= tomorrowStart;
  }).length;

  const todayCount = allTasks.filter((task) => {
    if (!task.dueDate) return false;
    if (task.status === "Completed") return false;

    const dueDate = new Date(task.dueDate);

    return (
      dueDate >= todayStart &&
      dueDate < tomorrowStart
    );
  }).length;

  const getCount = (type) => {
    if (type === "upcoming") {
      return upcomingCount;
    }

    if (type === "today") {
      return todayCount;
    }

    return null;
  };


  return (
    <>
      {/* TASKS */}
      <div>
        <h2 className="mb-5 border-t border-gray-200 mt-8 pt-6 text-sm font-bold tracking-wider text-gray-500 uppercase">
          Tasks
        </h2>

        <div className="space-y-2">
          {tasks.map((task) => {
            const Icon = task.icon;
            const count = getCount(task.type);

            return (
              <NavLink
                key={task.path}
                to={task.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                                flex items-center justify-between
                                rounded-lg px-4 py-3
                                transition
                                ${isActive
                    ? "bg-gray-200 text-black"
                    : "text-gray-700 hover:bg-gray-200"
                  }
                                `
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />

                  <span className="font-medium">
                    {task.title}
                  </span>
                </div>

                {count !== null && (
                  <span className="rounded bg-white px-2 py-1 text-xs font-semibold">
                    {count}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </>
  );
}
export default Tasks;
