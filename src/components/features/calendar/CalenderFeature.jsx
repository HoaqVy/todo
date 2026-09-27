import { useTasks } from "@/context/useTasks";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function CalendarFeature() {
  const { tasks = [], loading } = useTasks();

  const [currentDate, setCurrentDate] = useState(new Date())

  if (loading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading tasks...
        </p>
      </div>
    );
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();


  // Tổng số ngày của tháng
  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  // Ngày đầu tiên của tháng
  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  // Chuyển Sunday = 0 thành Monday = 0
  const startDay =
    firstDay === 0 ? 6 : firstDay - 1;

  const days = [];

  // Các ô trống trước ngày 1
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // Thêm các ngày trong tháng
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  // Lay task cua 1 ngay cu the
  const getTasksForDay = (day) => {
    if (!day) return []

    return tasks.filter((task) => {
      if (!task.dueDate) return false

      const dueDate = new Date(task.dueDate)

      return (
        dueDate.getFullYear() === year &&
        dueDate.getMonth() === month &&
        dueDate.getDate() === day
      )
    })
  }
  // thang truoc
  const hanldePreviousMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    )
  }

  // Thang sau
  const handleNextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    )
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700";

      case "In Progress":
        return "bg-blue-50 text-blue-700";

      case "Todo":
      default:
        return "bg-amber-50 text-amber-700";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500";

      case "Medium":
        return "bg-yellow-500";

      case "Low":
      default:
        return "bg-gray-400";
    }
  };

  const isToday = (day) => {
    if (!day) return false
    const today = new Date()

    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    )
  }

  return (
    <div>

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-black">
          Calendar
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View your tasks by date
        </p>
      </div>

      {/* Calendar */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Calender Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={hanldePreviousMonth}
            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100"
            title="Previous month">
            <ChevronLeft size={20} />
          </button>
          {/* Month */}
          <h2 className="text-xl font-bold text-gray-900">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>

          <button
            type="button"
            onClick={handleNextMonth}
            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100"
            title="Next month">
            <ChevronRight size={20} />
          </button>
        </div>


        {/* Week days */}
        <div className="grid grid-cols-7 border-b border-gray-200 pb-3">
          {[
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
          ].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayTasks = getTasksForDay(day)
            return (
              <div
                key={index}
                className={`min-h-24 min-w-0 overflow-hidden border-b border-r border-gray-100 p-3 ${isToday(day) ? "bg-blue-50/50" : "bg-white"}`}
              >
                {day && (
                  <>
                    {/* Day number */}
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${isToday(day) ? "bg-blue-500 text-white" : "text-gray-900"}`}>

                    </div>

                    {/* Tasks */}
                    {dayTasks.map((task) => (
                      <Link
                        key={task._id}
                        to={`/dashboard/edit/${task._id}`}
                        className={`flex w-full min-w-0 items-center gap-2 overflow-hidden rounded-md px-2 py-1 text-xs transition hover:opacity-80 ${getStatusStyle(
                          task.status
                        )}`}
                        title={`${task.title} - ${task.status} - ${task.priority}`}
                      >
                        {/* Priority dot */}
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${getPriorityColor(
                            task.priority
                          )}`}
                        />

                        {/* Task title */}
                        <span
                          className={`min-w-0 flex-1 truncate ${task.status === "Completed"
                            ? "line-through opacity-70"
                            : ""
                            }`}
                        >
                          {task.title}
                        </span>
                      </Link>
                    ))}
                  </>
                )
                }
              </div>
            );
          })}
        </div>
      </div>
    </div >
  );
}

export default CalendarFeature;
