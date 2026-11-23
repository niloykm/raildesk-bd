import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import { App } from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";

// Purge legacy cache-first service worker ('newrl-cache-v1') that served stale index.html
if (typeof window !== "undefined") {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().catch(() => {});
        }
      })
      .catch(() => {});
  }

  if ("caches" in window) {
    caches
      .keys()
      .then((keys) => {
        for (const key of keys) {
          if (key.startsWith("newrl-")) {
            caches.delete(key).catch(() => {});
          }
        }
      })
      .catch(() => {});
  }

  // Auto-recover if a newly deployed hashed Vite chunk fails to preload
  window.addEventListener("vite:preloadError", () => {
    const reloadKey = "nrl-preload-reloaded";
    if (!sessionStorage.getItem(reloadKey)) {
      sessionStorage.setItem(reloadKey, "1");
      window.location.reload();
    }
  });
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </ErrorBoundary>
    </StrictMode>
  );
}
