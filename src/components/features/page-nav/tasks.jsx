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
    count: 2,
  },
  {
    title: "Today",
    path: "/today",
    icon: HiOutlineClipboardList,
    count: 2,
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

function Tasks() {
  return (
    <>
      {/* TASKS */}
      <div>
        <h2 className="mb-5 border-t border-gray-200 mt-8 pt-6 text-sm font-bold tracking-wider text-gray-500 uppercase">
          Tasks
        </h2>
        <div className="space-y-2">
          {tasks.map((task) => (
            <NavLink
              key={task.path}
              to={task.path}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-lg px-4 py-3 ${isActive
                  ? "bg-gray-200 text-black"
                  : "hover:bg-gray-200"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <task.icon size={20} />
                <span className="font-medium">{task.title}</span>
              </div>

              {task.count && (

                <span className="rounded bg-white px-2 py-1 text-xs font-semibold">
                  {task.count ? task.count : null}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}
export default Tasks;
