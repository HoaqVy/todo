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
    const [period, setPeriod] = useState("This week")
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
                <Filter value={period} onChange={setPeriod} className="w-40" />
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
        </div>
    );
}
export default TaskOverview