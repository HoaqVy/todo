const defaultTasks = [
    {
        id: 1,
        title: 'Design Homepage',
        assignee: 'Hoang Vy',
        date: 'Today',
        status: 'Completed',
    },
    {
        id: 2,
        title: 'Implement Login',
        assignee: 'Nguyen Van A',
        date: 'Today',
        status: 'In Progress',
    },
    {
        id: 3,
        title: 'Create Dashboard',
        assignee: 'Hoang Vy',
        date: 'Yesterday',
        status: 'Todo',
    },
]

export default function TaskItem({ tasks = defaultTasks }) {
    return (
        <div className="w-full max-w-prose  rounded-xl border border-gray-200 bg-white  shadow-sm p-6  font-mono text-gray-500  sm:grid-cols-2 ">
            {/* Header */}
            <h3 className="mb-5 text-lg font-bold tracking-wide text-gray-500"> Recent Task</h3>
            <div className="space-y-1">
                {tasks.map((task, index) => (
                    <div key={task.id || index} className="relative border border-gray-200 bg-white- p-3 text-sm text-gray">
                        <div className="font-semibold text-gray">{task.title} </div>
                        <div className="mt-1 text-xs text-gray"> {task.owner} <span className="mt-1">•</span> {task.date} </div>
                        <div className="mt-2 text-right text-xs font-medium text-gray">{task.status}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
