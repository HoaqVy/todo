import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import getTasks from "@/api/taskApi";

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get tasks from API
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getTasks();
                setTasks(data);
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

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
                loading,
                addTask,
                updateTask,
                deleteTask,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    return useContext(TaskContext);
}