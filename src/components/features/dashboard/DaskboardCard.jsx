import { CircleCheck, ClipboardList, Clock, TriangleAlert } from "lucide-react"

function DashboardCard({ tasks = [] }) {
    const totalTasks = tasks.length

    const completedTasks = tasks.filter(
        (task) => task.status === "Completed"
    ).length

    const inProgressTasks = tasks.filter(
        (task) => task.status === "In Progress"
    ).length

    const overdueTasks = tasks.filter(
        (task) => {
            if (!task.dueDate || task.status === "Completed") return false
            return new Date(task.dueDate) < new Date()
        }
    ).length

    // Safe percentage calculation to handle empty task list
    const completedPercentage = totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0

    const cards = [
        {
            title: "Total Tasks",
            value: totalTasks,
            icon: ClipboardList,
            description: "All tasks"
        },
        {
            title: "Completed",
            value: completedTasks,
            icon: CircleCheck,
            description: `${completedPercentage}% of total tasks`
        },
        {
            title: "In Progress",
            value: inProgressTasks,
            icon: Clock,
            description: "Tasks in progress"
        },
        {
            title: "Overdue",
            value: overdueTasks,
            icon: TriangleAlert,
            description: "Overdue tasks"
        },
    ]

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon

                return (
                    <div key={card.title}
                        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                                <p className="text-3xl mt-2 font-bold text-gray-900">{card.value}</p>
                            </div>

                            <div className="rounded-lg bg-gray-100 p-3">
                                <Icon size={22} className="text-gray-700" />
                            </div>
                        </div>
                        <p className="mt-4 text-xs text-gray-500">{card.description}</p>
                    </div>
                )
            })}
        </div>
    )
} export default DashboardCard