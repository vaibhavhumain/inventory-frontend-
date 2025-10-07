"use client"
import API from "./api";

export const frontendLog = async (level, message, meta = {}) => {
  try {
    await API.post("/logs/frontend", { level, message, meta });
  } catch (err) {
    console.error("Failed to send frontend log:", err);
  }
};
