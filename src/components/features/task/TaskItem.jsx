import Button from "@/components/common/Button";
import { useToast } from "@/context/ToastContext";
import { useTasks } from "@/context/useTasks";
import {
    CheckCircle2,
    Circle,
    Clock,
    Pencil,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function TaskItem({
    tasks = [],
    title = "Recent Tasks",
    subtitle = "Your latest tasks"
}) {

    const { removeTask } = useTasks()
    const { showToast } = useToast()
    const [deletingId, setDeletingId] = useState(null)

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

    const formatDate = (date) => {
        if (!date) return "No due date"
        return new Date(date).toLocaleDateString("en-GB")
    }

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        )
        if (!confirmed) return

        try {
            setDeletingId(id)
            await removeTask(id)
            showToast("Task deleted successfully")
        } catch (error) {
            console.error("Failed to delete task:", error);
            showToast("Failed to delete task:", error)

        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="rounded-xl border border-gray-300 bg-white p-6 shadow-sm">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">
                        {title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        {subtitle}
                    </p>
                </div>

                <span className="text-sm text-gray-500">
                    {tasks.length} tasks
                </span>
            </div>

            {/* Task list */}
            <div className="mt-6 space-y-3 max-h-60 overflow-y-auto pr-2">
                {tasks.length === 0 ? (
                    <div className="py-8 text-center text-sm text-gray-500">
                        No tasks found
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task._id}
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
                                        Due: {formatDate(task.dueDate)}
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

                            {/* Edit */}
                            <Link
                                to={`/dashboard/edit/${task._id}`}
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                                title="Edit task">
                                <Pencil size={17} />
                            </Link>

                            {/* Delete */}
                            <Button
                                variant="danger"
                                size="icon"
                                icon={Trash2}
                                onClick={() => handleDelete(task._id)}
                                title="Delete task"
                                loading={deletingId === task._id}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default TaskItem;