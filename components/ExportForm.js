"use client";
import { useMemo, useState } from "react";
import API from "../utils/api";

export default function ExportForm() {
  const [date, setDate] = useState(() => today());
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const isDisabled = useMemo(() => !date, [date]);

  async function handleDownload(e) {
    e.preventDefault();
    setErr(""); 
    setLoading(true);
    try {
      const res = await API.get(`/export/${date}`, { responseType: "blob" });

      const cd = res.headers["content-disposition"] || "";
      const name = /filename\*=UTF-8''([^;]+)|filename="?([^"]+)"?/i.exec(cd);
      const fileName = decodeURIComponent(
        name?.[1] || name?.[2] || `stock-report_${date}.xlsx`
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setErr(error?.response?.data?.error || "Failed to download. Check date/route.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleDownload} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={date}
          max={today()}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {err && (
        <p className="text-red-600 text-sm border border-red-200 bg-red-50 p-2 rounded">
          {err}
        </p>
      )}

      <button
        type="submit"
        disabled={isDisabled || loading}
        className={`w-full py-2.5 rounded-lg shadow ${
          isDisabled || loading
            ? "bg-gray-300 text-gray-600"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        {loading ? "Preparing..." : "Download Excel"}
      </button>
    </form>
  );
}

function today() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dd}`;
}
