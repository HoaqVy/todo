import Button from "@/components/common/Button";
import { useTasks } from "@/context/useTasks";
import { CirclePlus } from "lucide-react";
import { useMemo } from "react";
import TaskItem from "../task/TaskItem";

function TodayFeature() {
  const { tasks = [], loading } = useTasks()

  const todayTasks = useMemo(() => {
    const today = new Date()

    const year = today.getFullYear()
    const month = today.getMonth()
    const date = today.getDate()

    return tasks.filter((task) => {
      if (!task.dueDate) return false

      const dueDate = new Date(task.dueDate)

      return (
        dueDate.getFullYear() === year &&
        dueDate.getMonth() === month &&
        dueDate.getDate() === date
      );
    })
  }, [tasks])

  if (loading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <p className="text-sm text-gray-500">Loading tasks....</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-black">Today</h1>
          <p className="mt-1 text-sm text-gray-500">Tasks that are due today</p>
        </div>
        <Button href="/create-task" icon={CirclePlus} />
      </div>

      {/* Total */}
      <div className="mt-6">
        <p className="text-sm text-gray-500">{todayTasks.length} tasks today</p>
      </div>

      {/* Tasks */}
      <div className="mt-4">
        <TaskItem tasks={todayTasks} title="Today's Tasks" subtitle="Tasks that are due today" />
      </div>
    </div>
  )
}

export default TodayFeature