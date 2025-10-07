"use client";
import { useEffect, useState, useRef } from "react";
import API from "../../../../utils/api";
  
export default function LogsDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [newLogFlash, setNewLogFlash] = useState(false);
  const intervalRef = useRef(null);

  const fetchLogs = async () => {
    try {
      const { data } = await API.get("/logs");
      setLogs((prev) => {
        if (prev.length && data.length > prev.length) {
          setNewLogFlash(true);
          setTimeout(() => setNewLogFlash(false), 1500);
        }
        return data;
      });
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error loading logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchLogs, 10000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [autoRefresh]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#02040a] text-green-300 text-lg animate-fadeIn">
        <div className="relative w-12 h-12 border-4 border-t-transparent border-green-500 rounded-full animate-spin-glow mb-4"></div>
        <span className="tracking-widest text-sm text-green-400/70 animate-pulse">
          INITIALIZING TERMINAL...
        </span>
      </div>
    );
  return (
    <div className="bg-[#02040a] text-gray-300 min-h-screen w-full font-mono relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
      <div className="relative z-10 pt-6 px-6 pb-20">
        <div className="max-w-[1800px] mx-auto w-full">
          <div className="flex flex-wrap justify-between items-center mb-4 border-b border-cyan-700/40 pb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-400"></span>
              </div>
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 tracking-widest drop-shadow-[0_0_6px_rgba(0,255,180,0.5)]">
                ⚙ SYSTEM LOG CONSOLE
              </h2>
            </div>
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <span className="text-sm text-gray-400 italic">
                  SYNC:{" "}
                  {lastUpdated.toLocaleTimeString("en-IN", { hour12: false })}
                </span>
              )}
              <button
                onClick={() => setAutoRefresh((p) => !p)}
                className={`px-3 py-1 rounded text-sm font-semibold border transition-all ${
                  autoRefresh
                    ? "bg-green-600/10 border-green-500 text-green-400 hover:bg-green-600/30"
                    : "bg-gray-700/20 border-gray-600 text-gray-400 hover:bg-gray-600/40"
                }`}
              >
                {autoRefresh ? "LIVE MODE: ACTIVE" : "LIVE MODE: OFF"}
              </button>

              <button
                onClick={fetchLogs}
                className="px-3 py-1 rounded text-sm border border-cyan-400 text-cyan-300 hover:bg-cyan-500/20 transition-all"
              >
                🔄 REFRESH
              </button>
            </div>
          </div>
          <div className="relative bg-[#060b13]/80 backdrop-blur-md rounded-lg shadow-2xl border border-cyan-700/40 overflow-y-auto h-[80vh] text-sm transition-all duration-700">
            <div
              className={`absolute inset-0 rounded-lg border border-green-400/20 blur-md transition-opacity duration-700 pointer-events-none ${
                newLogFlash ? "opacity-100" : "opacity-0"
              }`}
            ></div>

            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10 bg-[#0a121e]/95 backdrop-blur-md border-b border-cyan-700/40 text-gray-400 text-xs font-semibold tracking-widest uppercase">
                <tr>
                  <th className="px-3 py-2 text-left w-[14%]">Time</th>
                  <th className="px-3 py-2 text-left w-[8%]">Level</th>
                  <th className="px-3 py-2 text-left w-[14%]">Source</th>
                  <th className="px-3 py-2 text-left w-[10%]">User</th>
                  <th className="px-3 py-2 text-left">Message</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">
                {logs.map((log, i) => (
                  <tr
                    key={log._id || i}
                    className={`hover:bg-[#0e1827]/80 transition-all duration-300 ease-out animate-slideIn border-l-2 ${
                      log.level === "error"
                        ? "border-red-500/50"
                        : log.level === "warn"
                        ? "border-yellow-400/40"
                        : "border-green-400/40"
                    }`}
                    style={{ animationDelay: `${i * 15}ms` }}
                  >
                    <td className="px-3 py-2 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("en-IN", {
                        hour12: false,
                      })}
                    </td>
                    <td
                      className={`px-3 py-2 text-xs font-bold ${
                        log.level === "error"
                          ? "text-red-500 drop-shadow-[0_0_3px_rgba(255,50,50,0.5)]"
                          : log.level === "warn"
                          ? "text-yellow-300 drop-shadow-[0_0_3px_rgba(255,255,150,0.5)]"
                          : "text-green-400 drop-shadow-[0_0_3px_rgba(0,255,150,0.5)]"
                      }`}
                    >
                      {log.level.toUpperCase()}
                    </td>
                    <td className="px-3 py-2 text-cyan-300 text-xs truncate">
                      {log.source || "system-core"}
                    </td>
                    <td className="px-3 py-2 text-purple-300 text-xs truncate">
                      {log.user?.name || "System"}
                    </td>
                    <td className="px-3 py-2 text-gray-300 text-xs break-words leading-snug">
                      {log.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
