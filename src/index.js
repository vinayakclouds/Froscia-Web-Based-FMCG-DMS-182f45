import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";

// Import global styles
import "./assets/styles/tailwind.css";

// Initialize Tailwind CSS from CDN
const tailwindScript = document.createElement("script");
tailwindScript.src = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";
document.head.appendChild(tailwindScript);

// Define theme colors
const root = document.documentElement;
root.style.setProperty("--color-primary-50", "#eef2ff");
root.style.setProperty("--color-primary-100", "#e0e7ff");
root.style.setProperty("--color-primary-200", "#c7d2fe");
root.style.setProperty("--color-primary-300", "#a5b4fc");
root.style.setProperty("--color-primary-400", "#818cf8");
root.style.setProperty("--color-primary-500", "#6366f1");
root.style.setProperty("--color-primary-600", "#4f46e5");
root.style.setProperty("--color-primary-700", "#4338ca");
root.style.setProperty("--color-primary-800", "#3730a3");
root.style.setProperty("--color-primary-900", "#312e81");

// Create the root React node
const rootElement = document.getElementById("root");
const rootNode = ReactDOM.createRoot(rootElement);

// Render the application wrapped with required providers
rootNode.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#ffffff",
              color: "#111827",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              borderRadius: "0.375rem",
              padding: "0.75rem 1rem",
            },
            success: {
              iconTheme: {
                primary: "#10B981",
                secondary: "#FFFFFF",
              },
            },
            error: {
              iconTheme: {
                primary: "#EF4444",
                secondary: "#FFFFFF",
              },
            },
          }}
        />
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

// Enable service worker registration for production builds
if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered with scope:", registration.scope);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

// Application version info
console.log("Froscia DMS v2.1.0");