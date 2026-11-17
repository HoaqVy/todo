import Filter from "@/components/common/Filter";
import { useMemo, useState } from "react";

const statusConfig = {
    Completed: {
        color: "bg-emerald-500",
    },
    "In Progress": {
        color: "bg-blue-500",
    },
    Todo: {
        color: "bg-amber-500",
    },
    Overdue: {
        color: "bg-rose-500",
    },
};


function TaskOverview({ tasks = [] }) {
    const [period, setPeriod] = useState("Select");

    // =========================
    // Filter theo Period
    // =========================
    const periodTasks = useMemo(() => {
        const today = new Date();

        // Today
        if (period === "Today") {
            return tasks.filter((task) => {
                if (!task.dueDate) return false;

                const dueDate = new Date(task.dueDate);

                return (
                    dueDate.getDate() === today.getDate() &&
                    dueDate.getMonth() === today.getMonth() &&
                    dueDate.getFullYear() === today.getFullYear()
                );
            });
        }

        // This Week
        if (period === "This Week") {
            const startOfWeek = new Date(today);
            const day = today.getDay();

            // Monday là ngày đầu tuần
            const diff = day === 0 ? -6 : 1 - day;

            startOfWeek.setDate(today.getDate() + diff);
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            return tasks.filter((task) => {
                if (!task.dueDate) return false;

                const dueDate = new Date(task.dueDate);

                return (
                    dueDate >= startOfWeek &&
                    dueDate <= endOfWeek
                );
            });
        }

        // This month
        if (period === "This Month") {
            return tasks.filter((task) => {
                if (!task.dueDate) return false;

                const dueDate = new Date(task.dueDate);

                return (
                    dueDate.getMonth() === today.getMonth() &&
                    dueDate.getFullYear() === today.getFullYear()
                );
            });
        }

        // This year
        if (period === "This Year") {
            return tasks.filter((task) => {
                if (!task.dueDate) return false;

                const dueDate = new Date(task.dueDate);

                return (
                    dueDate.getFullYear() === today.getFullYear()
                );
            });
        }

        return tasks;
    }, [tasks, period]);

    // =========================
    // Task Overview Data
    // =========================
    const overviewData = useMemo(() => {
        const completed = periodTasks.filter(
            (task) => task.status === "Completed"
        ).length;

        const inProgress = periodTasks.filter(
            (task) => task.status === "In Progress"
        ).length;

        const todo = periodTasks.filter(
            (task) => task.status === "Todo"
        ).length;

        const overdue = periodTasks.filter((task) => {
            if (!task.dueDate) return false;

            const today = new Date();
            const dueDate = new Date(task.dueDate);

            return (
                dueDate < today &&
                task.status !== "Completed"
            );
        }).length;

        return [
            {
                label: "Completed",
                count: completed,
                color: statusConfig.Completed.color,
            },
            {
                label: "In Progress",
                count: inProgress,
                color: statusConfig["In Progress"].color,
            },
            {
                label: "Todo",
                count: todo,
                color: statusConfig.Todo.color,
            },
            {
                label: "Overdue",
                count: overdue,
                color: statusConfig.Overdue.color,
            },
        ];
    }, [periodTasks]);

    return (
        <div className="w-full rounded-xl border border-gray-300 bg-white p-4 shadow-sm sm:p-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-bold tracking-wide text-gray-900">
                        Task Overview
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        Overview of your tasks
                    </p>
                </div>

                <Filter
                    value={period}
                    onChange={setPeriod}
                    options={[
                        "Today", "This Week", "This Month", "This Year"
                    ]}
                    className="w-full sm:w-40"
                />
            </div>

            {/* Chart */}
            <div className="mt-6 space-y-3">
                {overviewData.map((item) => (
                    <div
                        key={item.label}
                        className="flex min-w-0 items-center gap-2 sm:gap-4"
                    >
                        <span className="w-20 shrink-0 truncate text-xs text-gray-800 sm:w-28 sm:text-sm">
                            {item.label}
                        </span>

                        <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-hidden">
                            {Array.from({
                                length: item.count,
                            }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-3 w-1.5 shrink-0 rounded-[1px] sm:h-4 sm:w-2 ${item.color}`}
                                />
                            ))}
                        </div>

                        <span className="w-5 shrink-0 text-right text-sm font-bold text-gray-800 sm:w-6">
                            {item.count}
                        </span>
                    </div>
                ))}
            </div>

            {/* Number of tasks */}
            <div className="mt-6 border-t border-gray-100 pt-4">
                <span className="text-sm text-gray-500">
                    {periodTasks.length} tasks in {period}
                </span>
            </div>
        </div>
    );
}

export default TaskOverview;