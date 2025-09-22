"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import API from "../../../utils/api";

export default function StockSummaryPage() {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await API.get("/stock/summary");
        setSummary(res.data);
      } catch (err) {
        console.error("Error fetching stock summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-[98%] mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">📊 Stock Summary</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading summary...</p>
        ) : (
          <div className="bg-white rounded-lg shadow border border-gray-300 overflow-x-auto">
            <table className="w-full text-sm border-collapse text-center">
              <thead>
                {/* 🔹 First Row (Group Headers) */}
                <tr className="bg-green-100 text-gray-800 font-semibold">
                  <th rowSpan="2" className="border px-3 py-2">
                    Category / Item
                  </th>
                  <th colSpan="2" className="border px-3 py-2 bg-yellow-200">
                    Main Store
                  </th>
                  <th colSpan="3" className="border px-3 py-2 bg-blue-100">
                    Sub Store
                  </th>
                  <th colSpan="3" className="border px-3 py-2 bg-green-200">
                    Closing Inventory
                  </th>
                </tr>

                {/* 🔹 Second Row (Sub-headers) */}
                <tr className="bg-blue-600 text-white text-xs uppercase">
                  <th className="border px-3 py-2">Purchase (In)</th>
                  <th className="border px-3 py-2">Issue (Out)</th>
                  <th className="border px-3 py-2">Issue (In)</th>
                  <th className="border px-3 py-2">Consumption</th>
                  <th className="border px-3 py-2">Sale</th>
                  <th className="border px-3 py-2">Balance Qty</th>
                  <th className="border px-3 py-2">Balance Main Store</th>
                  <th className="border px-3 py-2">Balance Sub Store</th>
                </tr>
              </thead>
              <tbody>
                {summary.length > 0 ? (
                  summary.map((s, idx) => (
                    <tr
                      key={idx}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-yellow-50 transition`}
                    >
                      <td className="border px-3 py-2 font-medium text-blue-700 text-left">
                        {s.itemName}
                      </td>
                      <td className="border px-3 py-2">{s.purchaseIn}</td>
                      <td className="border px-3 py-2">{s.issueToSub}</td>
                      <td className="border px-3 py-2">{s.issueToSub}</td>
                      <td className="border px-3 py-2">{s.consumption}</td>
                      <td className="border px-3 py-2">{s.sale}</td>
                      <td className="border px-3 py-2">{s.balanceTotal}</td>
                      <td className="border px-3 py-2">{s.balanceMainStore}</td>
                      <td className="border px-3 py-2">{s.balanceSubStore}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
