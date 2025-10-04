"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import API from "../../../utils/api";
import SearchBar from "../../../components/SearchBar";

export default function StockSummaryPage() {
  const [summary, setSummary] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // ✅ Fetch summary and items in parallel
        const [summaryRes, itemsRes] = await Promise.all([
          API.get("/stock/summary"),
          API.get("/items"),
        ]);

        const itemsMap = {};
        itemsRes.data.forEach((it) => {
          itemsMap[it._id] = {
            code: it.code,
            headDescription: it.headDescription,
          };
        });

        // ✅ Merge item info into summary
        const enriched = (summaryRes.data || []).map((row) => ({
          ...row,
          code: itemsMap[row.itemId]?.code || "-",
          headDescription: itemsMap[row.itemId]?.headDescription || "-",
        }));

        setSummary(enriched);
        setFiltered(enriched);
      } catch (err) {
        console.error("Error fetching stock summary:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFiltered(summary);
      return;
    }
    const lower = query.toLowerCase();
    const results = summary.filter((s) =>
      Object.values(s).some(
        (val) => val && String(val).toString().toLowerCase().includes(lower)
      )
    );
    setFiltered(results);
  };

  const formatCurrency = (num) => (num ? `₹${Number(num).toFixed(2)}` : "₹0");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-[98%] mx-auto px-4 py-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by item, code, date, qty, amount..."
        />

        {loading ? (
          <p className="text-center text-gray-500">Loading summary...</p>
        ) : (
          <div className="bg-white rounded-lg shadow border border-gray-300 overflow-x-auto">
            <table className="w-full text-xs border-collapse text-center">
              <thead>
                {/* 🔹 Row 1 - Group Headers */}
                <tr className="font-bold text-white text-sm">
                  <th rowSpan="2" className="border px-2 py-2 bg-gray-700">
                    Date
                  </th>
                  <th colSpan="6" className="border px-2 py-2 bg-green-600">
                    Inventory Info
                  </th>
                  <th colSpan="2" className="border px-2 py-2 bg-amber-600">
                    Main Store
                  </th>
                  <th colSpan="2" className="border px-2 py-2 bg-blue-600">
                    Sub Store
                  </th>
                  <th colSpan="2" className="border px-2 py-2 bg-indigo-600">
                    Consumption
                  </th>
                  <th colSpan="2" className="border px-2 py-2 bg-purple-600">
                    Sale
                  </th>
                  <th colSpan="4" className="border px-2 py-2 bg-emerald-600">
                    Closing Inventory
                  </th>
                </tr>

                {/* 🔹 Row 2 - Column Headers */}
                <tr className="bg-gray-800 text-white">
                  <th className="border px-2 py-2">Item Code</th>
                  <th className="border px-2 py-2">Description</th>
                  <th className="border px-2 py-2">Opening (Main)</th>
                  <th className="border px-2 py-2">Opening (Sub)</th>
                  <th className="border px-2 py-2">Opening Total</th>
                  <th className="border px-2 py-2">Opening Amount</th>

                  <th className="border px-2 py-2">Purchase Qty</th>
                  <th className="border px-2 py-2">Purchase Amt</th>

                  <th className="border px-2 py-2">Issue Qty</th>
                  <th className="border px-2 py-2">Issue Amt</th>

                  <th className="border px-2 py-2">Qty</th>
                  <th className="border px-2 py-2">Amount</th>

                  <th className="border px-2 py-2">Qty</th>
                  <th className="border px-2 py-2">Amount</th>

                  <th className="border px-2 py-2">Closing (Main)</th>
                  <th className="border px-2 py-2">Closing (Sub)</th>
                  <th className="border px-2 py-2">Closing Total</th>
                  <th className="border px-2 py-2">Closing Amount</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="border px-2 py-2">
                        {row.date
                          ? new Date(row.date).toLocaleDateString("en-IN")
                          : "-"}
                      </td>
                      <td className="border px-2 py-2">{row.code}</td>
                      <td className="border px-2 py-2">{row.headDescription}</td>

                      <td className="border px-2 py-2">{row.openingMain}</td>
                      <td className="border px-2 py-2">{row.openingSub}</td>
                      <td className="border px-2 py-2">{row.openingTotal}</td>
                      <td className="border px-2 py-2">
                        {formatCurrency(row.openingAmount)}
                      </td>

                      <td className="border px-2 py-2">{row.purchaseQty}</td>
                      <td className="border px-2 py-2">
                        {formatCurrency(row.purchaseAmt)}
                      </td>

                      <td className="border px-2 py-2">{row.issueQty}</td>
                      <td className="border px-2 py-2">
                        {formatCurrency(row.issueAmt)}
                      </td>

                      <td className="border px-2 py-2">{row.consumptionQty}</td>
                      <td className="border px-2 py-2">
                        {formatCurrency(row.consumptionAmt)}
                      </td>

                      <td className="border px-2 py-2">{row.saleQty}</td>
                      <td className="border px-2 py-2">
                        {formatCurrency(row.saleAmt)}
                      </td>

                      <td className="border px-2 py-2">{row.closingMain}</td>
                      <td className="border px-2 py-2">{row.closingSub}</td>
                      <td className="border px-2 py-2">{row.closingTotal}</td>
                      <td className="border px-2 py-2">
                        {formatCurrency(row.closingAmount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="19"
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
