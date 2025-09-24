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
        // 1. Fetch stock summary
        const stockRes = await API.get("/stock/summary");

        // 2. Fetch purchase invoices for vendor/category info
        const invRes = await API.get("/purchase-invoices");

        // build lookup { itemId: { vendorName, hsnCode, headDescription, subDescription } }
        const invoiceMap = {};
        invRes.data.forEach((inv) => {
          inv.items.forEach((it) => {
            if (it.item?._id) {
              invoiceMap[it.item._id] = {
                vendorName: inv.partyName || "-",
                hsnCode: it.hsnCode || it.item.hsnCode || "-",
                headDescription: it.item.headDescription || "-",
                subDescription:
                  it.item.subDescription || it.overrideDescription || "-",
                code: it.item.code || "-",
              };
            }
          });
        });

        // 3. Merge
        const enriched = stockRes.data.map((s) => ({
          ...s,
          code: invoiceMap[s.itemId]?.code || "-",
          headDescription: invoiceMap[s.itemId]?.headDescription || "-",
          subDescription: invoiceMap[s.itemId]?.subDescription || "-",
          hsnCode: invoiceMap[s.itemId]?.hsnCode || "-",
          vendorName: invoiceMap[s.itemId]?.vendorName || "-",
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
        (val) => val && String(val).toLowerCase().includes(lower)
      )
    );
    setFiltered(results);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-[98%] mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          📊 Stock Summary
        </h1>

        <SearchBar
          onSearch={handleSearch}
          placeholder="Search item, vendor, code, HSN..."
        />

        {loading ? (
          <p className="text-center text-gray-500">Loading summary...</p>
        ) : (
          <div className="bg-white rounded-lg shadow border border-gray-300 overflow-x-auto">
            <table className="w-full text-sm border-collapse text-center">
              <thead>
                {/* 🔹 First Row (Group Headers) */}
                <tr className="text-white font-bold text-sm">
                  <th colSpan="3" className="border px-3 py-2 bg-green-600">
                    Inventory Info
                  </th>
                  <th colSpan="2" className="border px-3 py-2 bg-yellow-600">
                    Main Store
                  </th>
                  <th colSpan="2" className="border px-3 py-2 bg-blue-600">
                    Sub Store
                  </th>
                  <th colSpan="3" className="border px-3 py-2 bg-emerald-600">
                    Closing Inventory
                  </th>
                </tr>

                {/* 🔹 Second Row (Column Headers) */}
                <tr className="bg-gray-800 text-white text-xs uppercase">
                  <th className="border px-3 py-2">Code</th>
                  <th className="border px-3 py-2">Head Desc</th>
                  <th className="border px-3 py-2">Vendor</th>
                  <th className="border px-3 py-2">Purchase (In)</th>
                  <th className="border px-3 py-2">Issue (Out)</th>
                  <th className="border px-3 py-2">Consumption</th>
                  <th className="border px-3 py-2">Sale</th>
                  <th className="border px-3 py-2">Balance Qty</th>
                  <th className="border px-3 py-2">Balance Main</th>
                  <th className="border px-3 py-2">Balance Sub</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((s, index) => (
                    <tr
                      key={s.itemId || index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="border px-3 py-2">{s.code}</td>
                      <td className="border px-3 py-2">{s.headDescription}</td>
                      <td className="border px-3 py-2">{s.vendorName}</td>
                      <td className="border px-3 py-2">{s.purchaseIn}</td>
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
                      colSpan="10"
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
