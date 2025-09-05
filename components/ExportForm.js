"use client";
import { useMemo, useState } from "react";
import API from "../utils/api";

export default function ExportForm() {
  const [from, setFrom] = useState(today());
  const [to, setTo] = useState(""); // optional end date
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const isDisabled = useMemo(() => !from, [from]);

  async function handleDownload(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      // ✅ Backend expects ?from=...&to=...
      const query = to ? `?from=${from}&to=${to}` : `?from=${from}`;
      const res = await API.get(`/export${query}`, { responseType: "blob" });

      // ✅ Extract filename or fallback
      const cd = res.headers["content-disposition"] || "";
      const name = /filename\*=UTF-8''([^;]+)|filename="?([^"]+)"?/i.exec(cd);
      const fileName = decodeURIComponent(
        name?.[1] || name?.[2] || `inventory-report_${from}_to_${to || from}.xlsx`
      );

      // ✅ Trigger download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setErr(error?.response?.data?.error || "Failed to download. Check dates/route.");
    } finally {
      setLoading(false);
    }
  }

  // quick range helpers
  function setToday() {
    const t = today();
    setFrom(t);
    setTo("");
  }
  function setThisWeek() {
    const d = new Date();
    const day = d.getDay() || 7; // Sunday = 0 → 7
    const start = new Date(d);
    start.setDate(d.getDate() - day + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    setFrom(formatDate(start));
    setTo(formatDate(end));
  }
  function setThisMonth() {
    const d = new Date();
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    setFrom(formatDate(start));
    setTo(formatDate(end));
  }

  return (
    <form
      onSubmit={handleDownload}
      className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200 space-y-6"
    >
      {/* Header */}
      <div className="text-center border-b pb-3">
        <h2 className="text-xl font-bold text-gray-800">📊 Export Report</h2>
        <p className="text-sm text-gray-500">
          Download stock, supplier & bills history
        </p>
      </div>

      {/* Date Pickers */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From
          </label>
          <input
            type="date"
            value={from}
            max={today()}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To (optional)
          </label>
          <input
            type="date"
            value={to}
            min={from}
            max={today()}
            onChange={(e) => setTo(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Quick Buttons */}
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          type="button"
          onClick={setToday}
          className="px-4 py-1.5 text-sm font-medium rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-sm"
        >
          Today
        </button>
        <button
          type="button"
          onClick={setThisWeek}
          className="px-4 py-1.5 text-sm font-medium rounded-lg bg-green-50 hover:bg-green-100 text-green-700 shadow-sm"
        >
          This Week
        </button>
        <button
          type="button"
          onClick={setThisMonth}
          className="px-4 py-1.5 text-sm font-medium rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 shadow-sm"
        >
          This Month
        </button>
      </div>

      {/* Error */}
      {err && (
        <p className="text-red-600 text-sm border border-red-200 bg-red-50 p-2 rounded-md text-center">
          {err}
        </p>
      )}

      {/* Download Button */}
      <button
        type="submit"
        disabled={isDisabled || loading}
        className={`w-full py-3 rounded-lg font-semibold transition-all shadow-md ${
          isDisabled || loading
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
        }`}
      >
        {loading ? "⏳ Preparing..." : "⬇️ Download Excel"}
      </button>
    </form>
  );
}

function today() {
  return formatDate(new Date());
}

function formatDate(d) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dd}`;
}
