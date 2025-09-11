"use client";

import React, { useEffect, useState } from "react";
import AnalysisCard from "../../../components/AnalysisCard";
import AnalysisCharts from "../../../components/AnalysisCharts";
import Navbar from "../../../components/Navbar";
import API from "../../../utils/api";
import {
  Package,
  AlertTriangle,
  TrendingDown,
  BarChart3,
} from "lucide-react";

// Utility to get start/end of a month
function getMonthRange(year, month) {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  return {
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  };
}

export default function AnalyticsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-based
  const [stockValue, setStockValue] = useState(null);
  const [consumption, setConsumption] = useState([]);
  const [reorder, setReorder] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (y, m) => {
    try {
      setLoading(true);
      const { startDate, endDate } = getMonthRange(y, m);

      const [valRes, conRes, reoRes, trendRes] = await Promise.all([
        API.get("/analysis/stock-value"),
        API.get("/analysis/consumption", { params: { startDate, endDate } }),
        API.get("/analysis/reorder"),
        API.get("/analysis/consumption-trend"), // new endpoint for monthly
      ]);

      setStockValue(valRes.data);
      setConsumption(conRes.data.consumption || []);
      setReorder(reoRes.data);
      setMonthlyTrend(trendRes.data || []);
    } catch (err) {
      console.error("Error loading analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(year, month);
  }, [year, month]);

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  // Derived values
  const outOfStockCount = reorder.filter((r) => r.currentQty === 0).length;
  const belowReorderCount = reorder.filter((r) => r.needsReorder).length;
  const totalConsumption = consumption.reduce((sum, c) => sum + c.totalIssued, 0);

  // Top 5 consumption
  const top5Consumption = [...consumption]
    .sort((a, b) => b.totalIssued - a.totalIssued)
    .slice(0, 5)
    .map((c) => ({
      name: c.description || c.code || c._id,
      value: c.totalIssued,
    }));

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 min-h-screen p-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              📊 Inventory Analytics
            </h1>
            <p className="text-gray-500 mt-1">
              A simple overview of stock health and usage.
            </p>
          </div>

          {/* Month Selector */}
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <select
              className="border rounded-lg px-3 py-2 bg-white shadow-sm"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {months.map((m, idx) => (
                <option key={idx} value={idx}>
                  {m}
                </option>
              ))}
            </select>

            <select
              className="border rounded-lg px-3 py-2 bg-white shadow-sm"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {[2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="max-w-7xl mx-auto space-y-10">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <AnalysisCard
              title="Total Stock Value"
              value={stockValue?.totalStockValue?.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
              icon={<Package className="text-blue-600" size={28} />}
              color="blue"
            />

            <AnalysisCard
              title="Out of Stock Items"
              value={outOfStockCount}
              icon={<TrendingDown className="text-red-600" size={28} />}
              color="red"
            />

            <AnalysisCard
              title="Below Reorder"
              value={belowReorderCount}
              icon={<AlertTriangle className="text-orange-500" size={28} />}
              color="orange"
            />

            <AnalysisCard
              title={`Consumption (${months[month]})`}
              value={totalConsumption}
              icon={<BarChart3 className="text-green-600" size={28} />}
              color="green"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top 5 Issued */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
              <AnalysisCharts
                title={`Top 5 Issued Items (${months[month]} ${year})`}
                type="bar"
                data={top5Consumption}
              />
            </div>

            {/* Monthly Trend */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
              <AnalysisCharts
                title="Issues Over Time"
                type="line"
                data={monthlyTrend.map((t) => ({
                  name: `${months[t.month - 1]} ${t.year}`,
                  value: t.totalIssued,
                }))}
              />
            </div>
          </div>

          {/* Reorder Table */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="text-orange-500" /> Reorder Report
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border rounded-lg">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-2 text-left">Item Code</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-center">Current Qty</th>
                    <th className="p-2 text-center">Reorder Point</th>
                    <th className="p-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reorder.map((r, i) => (
                    <tr
                      key={i}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-2">{r.itemCode}</td>
                      <td className="p-2">{r.description}</td>
                      <td className="p-2 text-center">{r.currentQty}</td>
                      <td className="p-2 text-center">{r.reorderPoint}</td>
                      <td
                        className={`p-2 text-center font-semibold ${
                          r.needsReorder ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {r.needsReorder ? "Reorder" : "OK"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
