
import { useMemo } from "react";
import { useTasks } from "@/context/useTasks";
import { useAuth } from "@/context/AuthContext";
import TaskItem from "../task/TaskItem";

function MyTasksFeature() {
    const { tasks, loading, error } = useTasks();
    const { user } = useAuth();

    // Chỉ lấy những task do tài khoản hiện tại tạo
    const myTasks = useMemo(() => {
        return tasks.filter(
            (task) => String(task.createdBy) === String(user?._id)
        );
    }, [tasks, user]);

    const completedTasks = myTasks.filter(
        (task) => task.status === "Completed"
    ).length;

    const inProgressTasks = myTasks.filter(
        (task) => task.status === "In Progress"
    ).length;

    const totalTasks = myTasks.length;

    const overdueTasks = myTasks.filter((task) => {
        if (!task.dueDate || task.status === "Completed") {
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        return dueDate < today;
    }).length;

    const upcomingTasks = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return myTasks
            .filter((task) => {
                if (!task.dueDate || task.status === "Completed") {
                    return false;
                }

                const dueDate = new Date(task.dueDate);
                dueDate.setHours(0, 0, 0, 0);

                return dueDate >= today;
            })
            .sort(
                (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
            );
    }, [myTasks]);

    if (loading) {
        return <p className="p-6 text-gray-500">Loading tasks...</p>;
    }

    if (error) {
        return <p className="p-6 text-red-500">{error}</p>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    My Tasks
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Track and manage tasks created by you.
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-gray-200 bg-white p-5">
                        <p className="text-sm text-gray-500">My Total Tasks</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-900">
                            {totalTasks}
                        </h2>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-5">
                        <p className="text-sm text-gray-500">Completed</p>
                        <h2 className="mt-2 text-2xl font-bold text-green-600">
                            {completedTasks}
                        </h2>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-5">
                        <p className="text-sm text-gray-500">In Progress</p>
                        <h2 className="mt-2 text-2xl font-bold text-blue-600">
                            {inProgressTasks}
                        </h2>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-5">
                        <p className="text-sm text-gray-500">Overdue</p>
                        <h2 className="mt-2 text-2xl font-bold text-red-600">
                            {overdueTasks}
                        </h2>
                    </div>
                </div>

            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Upcoming Deadlines
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Tasks that need your attention.
                    </p>
                </div>

                {upcomingTasks.length === 0 ? (
                    <p className="py-4 text-center text-sm text-gray-500">
                        No upcoming deadlines.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {upcomingTasks.map((task) => (
                            <div
                                key={task._id}
                                className="flex items-center justify-between gap-4 rounded-lg bg-gray-50 p-4"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {task.title}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {new Date(task.dueDate).toLocaleDateString("vi-VN")}
                                    </p>
                                </div>

                                <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                    {task.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Overdue Tasks
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Tasks that have passed their deadlines.
                    </p>
                </div>

                {overdueTasks === 0 ? (
                    <p className="py-4 text-center text-sm text-gray-500">
                        No overdue tasks. Great job!
                    </p>
                ) : (
                    <div className="space-y-3">
                        {myTasks
                            .filter((task) => {
                                if (!task.dueDate || task.status === "Completed") {
                                    return false;
                                }

                                const today = new Date();
                                today.setHours(0, 0, 0, 0);

                                const dueDate = new Date(task.dueDate);
                                dueDate.setHours(0, 0, 0, 0);

                                return dueDate < today;
                            })
                            .map((task) => (
                                <div
                                    key={task._id}
                                    className="flex items-center justify-between gap-4 rounded-lg bg-red-50 p-4"
                                >
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {task.title}
                                        </p>

                                        <p className="mt-1 text-sm text-red-600">
                                            Due: {new Date(task.dueDate).toLocaleDateString("vi-VN")}
                                        </p>
                                    </div>

                                    <span className="shrink-0 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                                        Overdue
                                    </span>
                                </div>
                            ))}
                    </div>
                )}
            </div>

            {myTasks.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                        No tasks yet
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Tasks you create will appear here.
                    </p>
                </div>
            ) : (
                <TaskItem
                    tasks={myTasks}
                    title="My Tasks"
                    subtitle="Tasks created by your account"
                />
            )}
        </div>
    );
}

export default MyTasksFeature;
