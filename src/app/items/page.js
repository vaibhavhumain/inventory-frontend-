"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import API from "../../../utils/api";
import SearchBar from "../../../components/SearchBar";
import SupplierHistoryTable from "../../../components/SupplierHistoryTable";

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [historyData, setHistoryData] = useState({});

  const fetchItems = async () => {
    try {
      const res = await API.get("/purchase-invoices");

      const allItems = res.data.flatMap((inv) =>
        inv.items.map((it) => ({
          item: it.item,
          description: it.description,
          headQuantity: it.headQuantity,
          headQuantityMeasurement: it.headQuantityMeasurement,
          subQuantity: it.subQuantity,
          subQuantityMeasurement: it.subQuantityMeasurement,
          hsnCode: it.hsnCode,
          rate: it.rate,
          amount: it.amount,
          gstRate: it.gstRate,
          notes: it.notes,
          invoiceNumber: inv.invoiceNumber,
          partyName: inv.partyName,
          date: inv.date,
          location: "Main Store",
        }))
      );

      setItems(allItems);
      setFilteredItems(allItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSearch = (query) => {
    if (!query) {
      setFilteredItems(items);
      return;
    }
    const lower = query.toLowerCase();
    setFilteredItems(
      items.filter(
        (it) =>
          it.item?.toLowerCase().includes(lower) ||
          it.description?.toLowerCase().includes(lower) ||
          it.hsnCode?.toLowerCase().includes(lower) ||
          it.notes?.toLowerCase().includes(lower)
      )
    );
  };

  const fetchHistory = async (code) => {
    try {
      const res = await API.get(`/purchase-invoices/items/${code}/history`);
      setHistoryData((prev) => ({
        ...prev,
        [code]: {
          supplierHistory: res.data.supplierHistory || [],
          stock: res.data.stock || [],
        },
      }));
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const toggleHistory = async (code) => {
    if (expandedRow === code) {
      setExpandedRow(null);
      return;
    }
    await fetchHistory(code);
    setExpandedRow(code);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-[95%] mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowSearch((prev) => !prev)}
            className="px-4 py-2 rounded-lg bg-gray-600 text-white shadow hover:bg-gray-700 transition font-medium"
          >
            🔍 Search
          </button>
        </div>

        {showSearch && (
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} />
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Loading items...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-fixed">
                <thead className="bg-gradient-to-r from-blue-700 to-blue-600 text-white text-xs uppercase sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 w-[60px]">S.No</th>
                    <th className="px-4 py-2 w-[40px]">Item</th>
                    <th className="px-4 py-2 w-[70px]">Description</th>
                    <th className="px-4 py-2 w-[100px]">Head Qty</th>
                    <th className="px-4 py-2 w-[100px]">Head UOM</th>
                    <th className="px-4 py-2 w-[100px]">Sub Qty</th>
                    <th className="px-4 py-2 w-[100px]">Sub UOM</th>
                    <th className="px-4 py-2 w-[110px]">HSN Code</th>
                    <th className="px-4 py-2 w-[40px]">Rate</th>
                    <th className="px-4 py-2 w-[50px]">Amount</th>
                    <th className="px-4 py-2 w-[100px]">GST %</th>
                    <th className="px-4 py-2 w-[120px]">Location</th>
                    <th className="px-4 py-2 w-[100px]">History</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredItems.map((it, index) => (
                    <React.Fragment key={`${it.item}-${index}`}>
                      <tr className="hover:bg-blue-50 transition duration-150">
                        <td className="px-4 py-2 text-center">{index + 1}</td>
                        <td className="px-4 py-2 font-semibold text-blue-700">{it.item}</td>
                        <td className="px-4 py-2">{it.description || "-"}</td>
                        <td className="px-4 py-2 text-center">{it.headQuantity}</td>
                        <td className="px-4 py-2 text-center">{it.headQuantityMeasurement}</td>
                        <td className="px-4 py-2 text-center">{it.subQuantity}</td>
                        <td className="px-4 py-2 text-center">{it.subQuantityMeasurement}</td>
                        <td className="px-4 py-2 text-center">{it.hsnCode}</td>
                        <td className="px-4 py-2 text-right">{it.rate}</td>
                        <td className="px-4 py-2 text-right">{it.amount}</td>
                        <td className="px-4 py-2 text-center">{it.gstRate}</td>
                        <td className="px-4 py-2 text-center">{it.location}</td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => toggleHistory(it.item)}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            {expandedRow === it.item ? "Hide" : "View"}
                          </button>
                        </td>
                      </tr>

                      {expandedRow === it.item && (
                        <tr>
                          <td colSpan="13" className="px-6 py-4 bg-gray-50">
                            <SupplierHistoryTable
                              supplierHistory={
                                historyData[it.item]?.supplierHistory || []
                              }
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
