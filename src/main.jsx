import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { TaskProvider } from "@/context/TaskContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);