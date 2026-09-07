import {
  useEffect,
  useState,
} from "react";

import { getTasks, createTask } from "@/api/taskApi";
import { TaskContext } from "./TaskContext.js";

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const addTask = async (taskData) => {
    try {
      const newTask = await createTask(taskData);

      setTasks((prevTasks) => [newTask, ...prevTasks]);

      return newTask;
    } catch (error) {
      console.error("Failed to create task:", error);
      throw error;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        addTask
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}