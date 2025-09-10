"use client";
import { useEffect, useState, useMemo } from "react";
import AdminNavbar from "../../../../components/AdminNavbar";
import API from "../../../../utils/api";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";

export default function AdminReportsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState(""); 
  const [from, setFrom] = useState(today());
  const [to, setTo] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [err, setErr] = useState("");

  const isDisabled = useMemo(() => !from, [from]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get("/items");
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading items", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  async function handleDownload(e) {
    e.preventDefault();
    setErr("");
    setDownloading(true);
    try {
      const query = to ? `?from=${from}&to=${to}` : `?from=${from}`;
      const res = await API.get(`/export${query}`, { responseType: "blob" });

      const cd = res.headers["content-disposition"] || "";
      const name = /filename\*=UTF-8''([^;]+)|filename="?([^"]+)"?/i.exec(cd);
      const fileName = decodeURIComponent(
        name?.[1] || name?.[2] || `inventory-report_${from}_to_${to || from}.xlsx`
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
      setErr(error?.response?.data?.error || "Failed to download. Check dates/route.");
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        ⏳ Loading reports...
      </div>
    );
  }

  const categoryData = Object.values(
    items.reduce((acc, item) => {
      const cat = item.category || "Uncategorized";
      acc[cat] = acc[cat] || { name: cat, count: 0 };
      acc[cat].count += 1;
      return acc;
    }, {})
  );

  const stockStatus = [
    { name: "Low Stock", value: items.filter((i) => i.quantity <= 5).length },
    { name: "Healthy Stock", value: items.filter((i) => i.quantity > 5).length },
  ];

  const explanations = {
    category: "📊 Bar Chart shows number of items grouped by category.",
    stock: "🥧 Pie Chart shows stock health (≤ 5 = Low Stock, > 5 = Healthy).",
    both: "📊 + 🥧 Combined view of categories and stock health.",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <AdminNavbar />
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        {/* Header with dropdown */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">📊 Reports & Analysis</h1>
          <select
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            className="px-3 py-2 rounded-lg border text-gray-700 bg-white shadow-sm hover:border-gray-400"
          >
            <option value="">ℹ️ Chart Info</option>
            <option value="category">Items by Category</option>
            <option value="stock">Stock Health</option>
            <option value="both">Both Charts</option>
          </select>
        </div>

        {info && (
          <div className="p-4 bg-white border rounded-lg shadow text-sm text-gray-700">
            {explanations[info]}
          </div>
        )}

        {/* Export Form */}
        <form
          onSubmit={handleDownload}
          className="bg-white rounded-xl shadow p-6 border space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="date"
                value={from}
                max={today()}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To (optional)</label>
              <input
                type="date"
                value={to}
                min={from}
                max={today()}
                onChange={(e) => setTo(e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {err && <p className="text-red-600 text-sm">{err}</p>}

          <button
            type="submit"
            disabled={isDisabled || downloading}
            className={`w-full py-2 rounded-lg font-semibold ${
              isDisabled || downloading
                ? "bg-gray-300 text-gray-600"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {downloading ? "⏳ Preparing..." : "⬇️ Download Report"}
          </button>
        </form>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Items by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Stock Health</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={stockStatus} cx="50%" cy="50%" outerRadius={120} dataKey="value">
                  {stockStatus.map((entry, i) => (
                    <Cell key={i} fill={i === 0 ? "#ef4444" : "#10b981"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
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
