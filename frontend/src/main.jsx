import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

// Disable right click
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();

  toast.error("Right-click is restricted for security reasons.", {
    duration: 4000,
  });
});

// Block common DevTools shortcuts
document.addEventListener("keydown", (e) => {
  if (
    e.key === "F12" ||
    (e.ctrlKey &&
      e.shiftKey &&
      ["I", "J", "C"].includes(e.key.toUpperCase())) ||
    (e.ctrlKey && e.key.toUpperCase() === "U")
  ) {
    e.preventDefault();

    toast.error("Developer tools access is restricted.", {
      duration: 4000,
    });
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster position="top-center" />
  </React.StrictMode>,
);
