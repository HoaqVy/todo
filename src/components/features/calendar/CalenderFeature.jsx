import { useTasks } from "@/context/useTasks";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function CalendarFeature() {
  const { tasks = [], loading } = useTasks();

  const [currentDate, setCurrentDate] = useState(new Date());

  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center sm:min-h-75">
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

  // Lấy task của 1 ngày cụ thể
  const getTasksForDay = (day) => {
    if (!day) return [];

    return tasks.filter((task) => {
      if (!task.dueDate) return false;

      const dueDate = new Date(task.dueDate);

      return (
        dueDate.getFullYear() === year &&
        dueDate.getMonth() === month &&
        dueDate.getDate() === day
      );
    });
  };

  // Tháng trước
  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  };

  // Tháng sau
  const handleNextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

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
    if (!day) return false;

    const today = new Date();

    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  return (
    <div className="w-full min-w-0">

      {/* Header */}
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-black sm:text-4xl">
          Calendar
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View your tasks by date
        </p>
      </div>

      {/* Calendar */}
      <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:mt-6">

        {/* Calendar Header */}
        <div className="flex items-center justify-between gap-3 p-4 sm:mb-2 sm:p-6">

          {/* Previous */}
          <button
            type="button"
            onClick={handlePreviousMonth}
            className="
                            shrink-0 rounded-lg border border-gray-200
                            p-2 text-gray-600 transition
                            hover:bg-gray-100
                        "
            title="Previous month"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Month */}
          <h2 className="min-w-0 truncate text-center text-base font-bold text-gray-900 sm:text-xl">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>

          {/* Next */}
          <button
            type="button"
            onClick={handleNextMonth}
            className="
                            shrink-0 rounded-lg border border-gray-200
                            p-2 text-gray-600 transition
                            hover:bg-gray-100
                        "
            title="Next month"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Calendar scroll container */}
        <div className="overflow-x-auto">
          <div className="min-w-96">

            {/* Week days */}
            <div className="grid grid-cols-7 border-b border-gray-200 px-2 pb-3 sm:px-6">
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
                  className="
                                        text-center text-xs font-medium
                                        text-gray-500 sm:text-sm
                                    "
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 px-2 sm:px-6">
              {days.map((day, index) => {
                const dayTasks = getTasksForDay(day);

                return (
                  <div
                    key={index}
                    className={`
                                            min-h-24 min-w-0 overflow-hidden
                                            border-b border-r border-gray-100
                                            p-2 sm:min-h-28 sm:p-3
                                            ${isToday(day)
                        ? "bg-blue-50/50"
                        : "bg-white"
                      }
                                        `}
                  >
                    {day && (
                      <>
                        {/* Day number */}
                        <div
                          className={`
                                                        mb-2 flex h-7 w-7
                                                        items-center justify-center
                                                        rounded-full text-xs
                                                        font-medium sm:text-sm
                                                        ${isToday(day)
                              ? "bg-blue-500 text-white"
                              : "text-gray-900"
                            }
                                                    `}
                        >
                          {day}
                        </div>

                        {/* Tasks */}
                        <div className="space-y-1">
                          {dayTasks.map((task) => (
                            <Link
                              key={task._id}
                              to={`/dashboard/edit/${task._id}`}
                              className={`
                                                                flex w-full min-w-0
                                                                items-center gap-1.5
                                                                overflow-hidden
                                                                rounded-md px-1.5 py-1
                                                                text-[10px] transition
                                                                hover:opacity-80
                                                                sm:gap-2 sm:px-2 sm:text-xs
                                                                ${getStatusStyle(
                                task.status
                              )}
                                                            `}
                              title={`${task.title} - ${task.status} - ${task.priority}`}
                            >
                              {/* Priority dot */}
                              <span
                                className={`
                                                                    h-1.5 w-1.5
                                                                    shrink-0 rounded-full
                                                                    sm:h-2 sm:w-2
                                                                    ${getPriorityColor(
                                  task.priority
                                )}
                                                                `}
                              />

                              {/* Task title */}
                              <span
                                className={`
                                                                    min-w-0 flex-1 truncate
                                                                    ${task.status ===
                                    "Completed"
                                    ? "line-through opacity-70"
                                    : ""
                                  }
                                                                `}
                              >
                                {task.title}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarFeature;