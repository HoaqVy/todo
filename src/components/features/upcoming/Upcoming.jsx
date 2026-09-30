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
            <div className="flex min-h-60 items-center justify-center sm:min-h-75">
                <p className="text-sm text-gray-500">
                    Loading tasks...
                </p>
            </div>
        );
    }

    return (
        <div className="w-full min-w-0">

            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h1 className="text-2xl font-bold text-black sm:text-4xl">
                        Upcoming
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Tasks that are coming up
                    </p>
                </div>
            </div>


            {/* Total */}
            <div className="mt-5 sm:mt-6">
                <p className="text-sm text-gray-500">
                    {totalUpcoming} upcoming tasks
                </p>
            </div>

            {/* Tomorrow */}
            {groupedTasks.tomorrow.length > 0 && (
                <section className="mt-5 sm:mt-6">
                    <h2 className="mb-3 text-base font-semibold text-gray-900 sm:text-lg">
                        Tomorrow
                    </h2>

                    <TaskItem
                        tasks={groupedTasks.tomorrow}
                        title="Tomorrow"
                        subtitle="Tasks due tomorrow"
                    />
                </section>
            )}

            {/* This Week */}
            {groupedTasks.thisWeek.length > 0 && (
                <section className="mt-5 sm:mt-6">
                    <h2 className="mb-3 text-base font-semibold text-gray-900 sm:text-lg">
                        This Week
                    </h2>

                    <TaskItem
                        tasks={groupedTasks.thisWeek}
                        title="This Week"
                        subtitle="Tasks due later this week"
                    />
                </section>
            )}


            {/* Later */}
            {groupedTasks.later.length > 0 && (
                <section className="mt-5 sm:mt-6">
                    <h2 className="mb-3 text-base font-semibold text-gray-900 sm:text-lg">
                        Later
                    </h2>

                    <TaskItem
                        tasks={groupedTasks.later}
                        title="Later"
                        subtitle="Tasks scheduled for later"
                    />
                </section>
            )}


            {/* Empty */}
            {totalUpcoming === 0 && (
                <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:mt-6 sm:p-10">
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