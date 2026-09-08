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
      const updatedTask = await updateTaskApi(
        id,
        taskData
      )

      setTasks((prevTasks) => prevTasks.map((task) => task._id ? updatedTask : task))

      return updatedTask
    } catch (error) {
      console.error("Failed to update task:", error);
      throw error
    }
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        removeTask,
        updateTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}