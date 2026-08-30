import Filter from "@/components/common/Filter";
import { useMemo, useState } from "react";
import { isOverdue } from "./TaskUtils";

const statusConfig = {
    Completed: {
        color: "bg-emerald-500"
    },
    "In Progress": {
        color: "bg-blue-500"
    },
    Todo: {
        color: "bg-amber-500"
    },
    Overdue: {
        color: "bg-rose-500"
    }
}

function TaskOverview({ tasks = [] }) {
    const [period, setPeriod] = useState("This Week")

    // Filter task theo periods 
    const periodTasks = useMemo(() => {
        const today = new Date()

        return tasks.filter((task) => {
            if (!task.dueDate) return false

            const dueDate = new Date(task.dueDate)

            if (period === "This week") {
                const startOfWeek = new Date(today)
                const day = today.getDay()

                startOfWeek.setDate(
                    today.getDate() - day
                );
                startOfWeek.setHours(0, 0, 0, 0)

                const endOfWeek = new Date(startOfWeek)
                endOfWeek.setDate(
                    startOfWeek.getDate() + 6
                )
                endOfWeek.setHours(23, 59, 59, 999);

                return (
                    dueDate >= startOfWeek &&
                    dueDate <= endOfWeek
                )
            }

            if (period === "This month") {
                return (
                    dueDate.getMonth() === today.getMonth() &&
                    dueDate.getFullYear() === today.getFullYear()
                )
            }

            if (period === "This year") {
                return (
                    dueDate.getFullYear() === today.getFullYear()
                )
            }
            return true;
        })
    }, [tasks, period])


    // Tính OverviewData
    const overviewData = useMemo(() => {
        const completed = tasks.filter(
            (task) => task.status === "Completed"
        ).length;

        const inProgress = tasks.filter(
            (task) => task.status === "In Progress"
        ).length;

        const todo = tasks.filter(
            (task) => task.status === "Todo"
        ).length;

        const overdue = tasks.filter(isOverdue).length;

        return [
            {
                label: "Completed",
                count: completed,
                color: statusConfig.Completed.color
            },
            {
                label: "In Progress",
                count: inProgress,
                color: statusConfig["In Progress"].color
            },
            {
                label: "Todo",
                count: todo,
                color: statusConfig.Todo.color
            },
            {
                label: "Overdue",
                count: overdue,
                color: statusConfig.Overdue.color
            }
        ]
    }, [tasks])
    return (
        <div className="w-full max-w-prose rounded-xl border border-gray-300 bg-white p-6 shadow-sm font-mono ">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="mb-5 text-lg font-bold tracking-wide text-gray">Task Overview</h3>
                    <p className="mt-1 text-sm text-gray-500">Overview of your tasks</p>
                </div>
                <Filter
                    value={period}
                    onChange={setPeriod}
                    options={[
                        "Today",
                        "This Week",
                        "This month",
                        "This year",
                    ]}
                    placeholder="Period"
                    className="w-40"
                />
            </div>

            {/* Chart */}
            <div className="mt-6 space-y-3">
                {overviewData.map((item) => (
                    <div
                        key={item.label}
                        className="flex items-center gap-4"
                    >
                        <span className="w-28 truncate text-sm text-gray-800">
                            {item.label}
                        </span>

                        <div className="flex flex-1 items-center gap-0.5 overflow-hidden">
                            {Array.from({ length: item.count }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-4 w-2 rounded-[1px] ${item.color} transition-all hover:opacity-70`}
                                />
                            ))}
                        </div>

                        <span className="w-6 text-right text-sm font-bold text-gray-800">
                            {item.count}
                        </span>
                    </div>
                ))}
            </div>
            {/* Total */}
            <div className="mt-6 border-t border-gray-100 pt-4 text-sm text-gray-500">
                {periodTasks.length} tasks in {period.toLowerCase()}
            </div>
        </div>
    );
}
export default TaskOverview