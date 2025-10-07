"use client";
import { useEffect, useState, useRef } from "react";
import API from "../../../../utils/api";

export default function LogsDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  // Fetch logs
  const fetchLogs = async () => {
    try {
      const { data } = await API.get("/logs");
      setLogs((prev) => {
        // Optional: fade-in new logs only
        if (prev.length && data.length > prev.length) {
          const newOnes = data.slice(0, data.length - prev.length);
          return [...newOnes, ...prev];
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

  // Auto-refresh
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
      <div className="flex items-center justify-center h-screen bg-[#0d1117] text-gray-300 text-lg">
        Loading logs...
      </div>
    );

  return (
    <div className="bg-[#0d1117] text-gray-300 min-h-screen w-full">
      <div className="pt-6 px-6 pb-20">
        <div className="max-w-[1800px] mx-auto w-full">

          {/* Top Header */}
          <div className="flex flex-wrap justify-between items-center mb-4 border-b border-gray-700 pb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-400"></span>
              </div>
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-400">
                ⚙️ Live Application Logs
              </h2>
            </div>

            <div className="flex items-center gap-4">
              {lastUpdated && (
                <span className="text-sm text-gray-400 italic">
                  Last updated:{" "}
                  {lastUpdated.toLocaleTimeString("en-IN", { hour12: false })}
                </span>
              )}

              {/* Live Toggle */}
              <button
                onClick={() => setAutoRefresh((p) => !p)}
                className={`px-3 py-1 rounded text-sm font-semibold border transition-all ${
                  autoRefresh
                    ? "bg-green-600/20 border-green-500 text-green-400 hover:bg-green-600/30"
                    : "bg-gray-700/30 border-gray-600 text-gray-400 hover:bg-gray-600/50"
                }`}
              >
                {autoRefresh ? "LIVE MODE ON" : "LIVE MODE OFF"}
              </button>

              {/* Manual Refresh */}
              <button
                onClick={fetchLogs}
                className="px-3 py-1 rounded text-sm border border-blue-500 text-blue-400 hover:bg-blue-500/20 transition-all"
              >
                🔄 Refresh Now
              </button>
            </div>
          </div>

          {/* Logs Container */}
          <div className="relative bg-[#161b22] rounded-lg shadow-xl border border-gray-700 overflow-y-auto h-[80vh] font-mono text-sm group">
            {/* Scroll gradient */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-[#0d1117] to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#0d1117] to-transparent pointer-events-none"></div>

            {/* Column headers */}
            <div className="sticky top-0 z-10 bg-[#161b22]/95 backdrop-blur-sm border-b border-gray-700 px-4 py-2 flex text-gray-400 text-xs font-semibold tracking-wide">
              <div className="w-48">TIME</div>
              <div className="w-24">LEVEL</div>
              <div className="w-48">SOURCE</div>
              <div className="w-40">USER</div>
              <div className="flex-1">MESSAGE</div>
            </div>

            {/* Logs */}
            <div className="divide-y divide-gray-800">
              {logs.map((log, i) => (
                <div
                  key={log._id || i}
                  className="flex px-4 py-2 hover:bg-[#1e2630] transition-colors animate-fadeIn"
                  style={{ animationDelay: `${i * 10}ms` }}
                >
                  <div className="w-48 text-gray-500">
                    {new Date(log.createdAt).toLocaleString("en-IN", {
                      hour12: false,
                    })}
                  </div>

                  <div
                    className={`w-24 font-bold ${
                      log.level === "error"
                        ? "text-red-500"
                        : log.level === "warn"
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {log.level.toUpperCase()}
                  </div>

                  <div className="w-48 text-blue-400 truncate">
                    {log.source || "server"}
                  </div>

                  <div className="w-40 text-purple-300 truncate">
                    {log.user?.name || "System"}
                  </div>

                  <div className="flex-1 text-gray-300 break-words leading-snug">
                    {log.message}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
        </div>
      </div>
    </div>
  );
}

/* Tailwind CSS custom animation in globals.css
-----------------------------------------------
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-in-out;
}
----------------------------------------------- */
