import { useMemo } from "react";
import { useTasks } from "@/context/useTasks";
import TaskItem from "@/components/features/task/TaskItem";

function UpcomingFeature() {
    const { tasks = [], loading } = useTasks();

    const groupedTasks = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const endOfWeek = new Date(today);
        const day = endOfWeek.getDay();

        // Chủ nhật = 0 → đưa về cuối tuần
        const daysUntilSunday = day === 0 ? 0 : 7 - day;

        endOfWeek.setDate(endOfWeek.getDate() + daysUntilSunday);
        endOfWeek.setHours(23, 59, 59, 999);

        const result = {
            tomorrow: [],
            thisWeek: [],
            later: [],
        };

        tasks.forEach((task) => {
            if (!task.dueDate) return;
            if (task.status === "Completed") return;

            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);

            // Bỏ task quá hạn và task của hôm nay
            if (dueDate <= today) return;

            if (dueDate.getTime() === tomorrow.getTime()) {
                result.tomorrow.push(task);
            } else if (dueDate <= endOfWeek) {
                result.thisWeek.push(task);
            } else {
                result.later.push(task);
            }
        });

        const sortByDate = (a, b) =>
            new Date(a.dueDate) - new Date(b.dueDate);

        result.tomorrow.sort(sortByDate);
        result.thisWeek.sort(sortByDate);
        result.later.sort(sortByDate);

        return result;
    }, [tasks]);

    const totalUpcoming =
        groupedTasks.tomorrow.length +
        groupedTasks.thisWeek.length +
        groupedTasks.later.length;

    if (loading) {
        return (
            <div className="flex min-h-75 items-center justify-center">
                <p className="text-sm text-gray-500">
                    Loading tasks...
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-black">
                        Upcoming
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Tasks that are coming up
                    </p>
                </div>
            </div>

            {/* Total */}
            <div className="mt-6">
                <p className="text-sm text-gray-500">
                    {totalUpcoming} upcoming tasks
                </p>
            </div>

            {/* Tomorrow */}
            {groupedTasks.tomorrow.length > 0 && (
                <div className="mt-6">
                    <h2 className="mb-3 text-lg font-semibold text-gray-900">
                        Tomorrow
                    </h2>

                    <TaskItem
                        tasks={groupedTasks.tomorrow}
                        title="Tomorrow"
                        subtitle="Tasks due tomorrow"
                    />
                </div>
            )}

            {/* This Week */}
            {groupedTasks.thisWeek.length > 0 && (
                <div className="mt-6">
                    <h2 className="mb-3 text-lg font-semibold text-gray-900">
                        This Week
                    </h2>

                    <TaskItem
                        tasks={groupedTasks.thisWeek}
                        title="This Week"
                        subtitle="Tasks due later this week"
                    />
                </div>
            )}

            {/* Later */}
            {groupedTasks.later.length > 0 && (
                <div className="mt-6">
                    <h2 className="mb-3 text-lg font-semibold text-gray-900">
                        Later
                    </h2>

                    <TaskItem
                        tasks={groupedTasks.later}
                        title="Later"
                        subtitle="Tasks scheduled for later"
                    />
                </div>
            )}

            {/* Empty */}
            {totalUpcoming === 0 && (
                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-10 text-center">
                    <p className="text-sm font-medium text-gray-700">
                        No upcoming tasks
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        You don't have any upcoming tasks.
                    </p>
                </div>
            )}
        </div>
    );
}

export default UpcomingFeature;    