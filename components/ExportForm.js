"use client";
import { useMemo, useState } from "react";
import API from "../utils/api";

export default function ExportForm() {
  const [mode, setMode] = useState("single");
  const [date, setDate] = useState(() => today());
  const [startDate, setStartDate] = useState(() => today());
  const [endDate, setEndDate] = useState(() => today());
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const isDisabled = useMemo(() => {
    if (mode === "single") return !date;
    if (!startDate || !endDate) return true;
    return new Date(startDate) > new Date(endDate);
  }, [mode, date, startDate, endDate]);

  async function handleDownload(e) {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const params = mode === "single" ? { date } : { start: startDate, end: endDate };
      const res = await API.get("/reports/export", { params, responseType: "blob" });
      const cd = res.headers["content-disposition"] || "";
      const name = /filename\*=UTF-8''([^;]+)|filename="?([^"]+)"?/i.exec(cd);
      const fileName = decodeURIComponent(name?.[1] || name?.[2] || makeDefaultName(mode, { date, startDate, endDate }));
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url; a.download = fileName; document.body.appendChild(a); a.click(); a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setErr(error?.response?.data?.message || "Failed to download. Check dates/route.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleDownload} className="space-y-4">
      <div className="flex gap-3">
        <button type="button" onClick={() => setMode("single")}
          className={`px-3 py-1.5 rounded-lg border ${mode==="single"?"bg-blue-600 text-white border-blue-600":"bg-white text-gray-700"}`}>
          Single Day
        </button>
        <button type="button" onClick={() => setMode("range")}
          className={`px-3 py-1.5 rounded-lg border ${mode==="range"?"bg-blue-600 text-white border-blue-600":"bg-white text-gray-700"}`}>
          Date Range
        </button>
      </div>

      {mode === "single" ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input type="date" value={date} max={today()} onChange={(e)=>setDate(e.target.value)}
            className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input type="date" value={startDate} max={endDate || today()} onChange={(e)=>setStartDate(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input type="date" value={endDate} min={startDate} max={today()} onChange={(e)=>setEndDate(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
          </div>
        </div>
      )}

      {err && <p className="text-red-600 text-sm border border-red-200 bg-red-50 p-2 rounded">{err}</p>}

      <button type="submit" disabled={isDisabled || loading}
        className={`w-full py-2.5 rounded-lg shadow ${isDisabled||loading?"bg-gray-300 text-gray-600":"bg-green-600 hover:bg-green-700 text-white"}`}>
        {loading ? "Preparing..." : "Download Excel"}
      </button>
    </form>
  );
}

function today() { const d=new Date(); const m=String(d.getMonth()+1).padStart(2,"0"); const dd=String(d.getDate()).padStart(2,"0"); return `${d.getFullYear()}-${m}-${dd}`; }
function makeDefaultName(mode, {date,startDate,endDate}) { return mode==="single"?`stock-report_${date}.xlsx`:`stock-report_${startDate}_to_${endDate}.xlsx`; }
