import { createContext, useState } from "react";
import { tasks as initialTasks } from "@/data/tasks";

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState(initialTasks);

    const addTask = (task) => {
        setTasks((prev) => [
            ...prev,
            {
                ...task,
                id: Date.now(),
            },
        ]);
    };

    const updateTask = (id, updatedTask) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id
                    ? { ...task, ...updatedTask }
                    : task
            )
        );
    };

    const deleteTask = (id) => {
        setTasks((prev) =>
            prev.filter((task) => task.id !== id)
        );
    };

    return (
        <TaskContext.Provider
            value={{
                tasks,
                addTask,
                updateTask,
                deleteTask,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
}

// export function useTasks() {
//     return useContext(TaskContext);
// }