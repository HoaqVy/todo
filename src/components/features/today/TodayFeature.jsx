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
      <div className="flex min-h-60 items-center justify-center sm:min-h-75">
        <p className="text-sm text-gray-500">
          Loading tasks...
        </p>
      </div>
    )
  }

  return (
    <div className="w-full min-w-0">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-black sm:text-4xl">
            Today
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Tasks that are due today
          </p>
        </div>

        <Button
          href="/create-task"
          icon={CirclePlus}
          className="w-full sm:w-auto"
        >
          Create Task
        </Button>
      </div>

      {/* Total */}
      <div className="mt-5 sm:mt-6">
        <p className="text-sm text-gray-500">
          {todayTasks.length} tasks today
        </p>
      </div>

      {/* Tasks */}
      <div className="mt-4 sm:mt-5">
        <TaskItem
          tasks={todayTasks}
          title="Today's Tasks"
          subtitle="Tasks that are due today"
        />
      </div>
    </div>
  )
}

export default TodayFeature