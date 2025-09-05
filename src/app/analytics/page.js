"use client";

import React, { useEffect, useState } from "react";
import AnalysisCard from "../../../components/AnalysisCard";
import AnalysisCharts from "../../../components/AnalysisCharts";
import Navbar from "../../../components/Navbar";
import API from "../../../utils/api";
import { TrendingUp, AlertTriangle, Package } from "lucide-react";

// Utility to get start/end of a month
function getMonthRange(year, month) {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0); // last day of month
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
  const [turnover, setTurnover] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ NEW

  const fetchData = async (y, m) => {
    try {
      setLoading(true); // ✅ start loading
      const { startDate, endDate } = getMonthRange(y, m);

      const [valRes, conRes, reoRes, turRes] = await Promise.all([
        API.get("/analysis/stock-value"),
        API.get("/analysis/consumption", { params: { startDate, endDate } }),
        API.get("/analysis/reorder"),
        API.get("/analysis/turnover"),
      ]);

      setStockValue(valRes.data);
      setConsumption(conRes.data);
      setReorder(reoRes.data);
      setTurnover(turRes.data);
    } catch (err) {
      console.error("Error loading analytics:", err);
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  useEffect(() => {
    fetchData(year, month);
  }, [year, month]);

  // ✅ Calculate Fast vs Slow summary
  const fastCount = turnover.filter((t) => t.type === "Fast-moving").length;
  const slowCount = turnover.filter((t) => t.type === "Slow-moving").length;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 min-h-screen p-8">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              📊 Inventory Analytics
            </h1>
            <p className="text-gray-500 mt-1">
              Insights into stock usage, value, and performance.
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              title="Items Below Reorder"
              value={reorder.filter((r) => r.needsReorder).length}
              icon={<AlertTriangle className="text-red-600" size={28} />}
              color="red"
            />

            <AnalysisCard
              title="Fast-moving Items"
              value={fastCount}
              icon={<TrendingUp className="text-green-600" size={28} />}
              color="green"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Consumption by Item */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
              <AnalysisCharts
                title={`Consumption by Item (${months[month]} ${year})`}
                type="bar"
                data={
                  consumption.consumption?.map((c) => ({
                    name: c.description || c.code || c._id,
                    value: c.totalIssued,
                  })) || []
                }
              />
            </div>

            {/* Turnover Ratios */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
              <AnalysisCharts
                title="Turnover Ratio (by Item)"
                type="bar"
                data={turnover.map((t) => ({
                  name: t.itemCode,
                  value: Number(t.turnoverRatio.toFixed(2)),
                }))}
              />
            </div>

            {/* Fast vs Slow-moving */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition lg:col-span-2">
              <AnalysisCharts
                title="Fast vs Slow Moving Items"
                type="pie"
                data={[
                  { name: "Fast-moving", value: fastCount },
                  { name: "Slow-moving", value: slowCount },
                ]}
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