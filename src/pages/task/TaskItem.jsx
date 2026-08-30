import {
    CheckCircle2,
    Circle,
    Clock,
} from "lucide-react";

function TaskItem({ tasks = [] }) {
    const getStatusIcon = (status) => {
        switch (status) {
            case "Completed":
                return (
                    <CheckCircle2
                        size={18}
                        className="text-emerald-500"
                    />
                );

            case "In Progress":
                return (
                    <Clock
                        size={18}
                        className="text-blue-500"
                    />
                );

            case "Todo":
            default:
                return (
                    <Circle
                        size={18}
                        className="text-gray-400"
                    />
                );
        }
    };

    return (
        <div className="rounded-xl border border-gray-300 bg-white p-6 shadow-sm">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">
                        Recent Tasks
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        Your latest tasks
                    </p>
                </div>

                <span className="text-sm text-gray-500">
                    {tasks.length} tasks
                </span>
            </div>

            {/* Task list */}
            <div className="mt-6 space-y-3">
                {tasks.length === 0 ? (
                    <div className="py-8 text-center text-sm text-gray-500">
                        No tasks found
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 transition hover:bg-gray-50"
                        >
                            {/* Status */}
                            {getStatusIcon(task.status)}

                            {/* Task information */}
                            <div className="min-w-0 flex-1">
                                <h4 className="truncate text-sm font-medium text-gray-900">
                                    {task.title}
                                </h4>

                                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                    <span>
                                        {task.owner}
                                    </span>

                                    <span>•</span>

                                    <span className="text-red-500">
                                        Due: {task.dueDate}
                                    </span>
                                </div>
                            </div>

                            {/* Priority */}
                            <span
                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${task.priority === "High"
                                    ? "bg-red-50 text-red-600"
                                    : task.priority === "Medium"
                                        ? "bg-yellow-50 text-yellow-600"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {task.priority}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default TaskItem;