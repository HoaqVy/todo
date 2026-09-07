import { useContext } from "react";
import { TaskContext } from "./TaskContext.js";

export function useTasks() {
  return useContext(TaskContext);
}