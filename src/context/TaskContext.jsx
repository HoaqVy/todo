import {
  useEffect,
  useState,
} from "react";

import {
  getTasks,
  createTask,
  deleteTask,
  updateTask as updateTaskApi
} from "@/api/taskApi";

import { TaskContext } from "./TaskContext.js";

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTasks();

      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);

      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const removeTask = async (id) => {
    try {
      await deleteTask(id)

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id))
    } catch (error) {
      console.error("Failed to delete task:", error);
      throw error

    }
  }

  const updateTask = async (id, taskData) => {
    try {
      const updatedTask = await updateTaskApi(id, taskData);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? updatedTask : task
        )
      );

      return updatedTask;
    } catch (error) {
      console.error("Failed to update task:", error);
      throw error;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        addTask,
        removeTask,
        updateTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}