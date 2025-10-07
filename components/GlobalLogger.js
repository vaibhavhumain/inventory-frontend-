"use client";
import { useEffect } from "react";
import API from "../utils/api";

export default function GlobalLogger() {
  useEffect(() => {
    const logEvent = async (level, message, meta = {}) => {
      try {
        await API.post("/logs/frontend", { level, message, meta });
      } catch (err) {
        console.warn("Logging failed:", err.message);
      }
    };

    const handleError = (event) => {
      logEvent("error", event.message, {
        file: event.filename,
        line: event.lineno,
        column: event.colno,
      });
    };

    const handleRejection = (event) => {
      logEvent("error", "Unhandled Promise Rejection", {
        reason: event.reason?.message || event.reason,
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    logEvent("info", "Frontend session started", {
      url: window.location.pathname,
    });

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
