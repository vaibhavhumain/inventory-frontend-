"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import API from "../../../utils/api";
import SearchBar from "../../../components/SearchBar";
import AddItemForm from "../../../components/AddItemForm";
import ItemModal from "../../../components/ItemModal";
import SubToUserHistoryTable from "../../../components/SubToUserHistoryTable";
import StockHistoryTable from "../../../components/StockHistoryTable";
import SupplierHistoryTable from "../../../components/SupplierHistoryTable";
import Link from "next/link";

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const [expandedRow, setExpandedRow] = useState(null);
  const [historyData, setHistoryData] = useState({});

  const LOW_STOCK_THRESHOLD = 10;

  // Fetch items
  const fetchItems = async () => {
    try {
      const res = await API.get("/items");
      const sorted = [...res.data].sort((a, b) =>
        (a.category || "").localeCompare(b.category || "")
      );
      setItems(sorted);
      setFilteredItems(sorted);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Add new item
  const handleSaveItem = async (newItem) => {
    try {
      const res = await API.post("/items", newItem);
      const saved = res.data;

      setItems((prev) => {
        const exists = prev.some((it) => it.code === saved.code);
        if (exists) {
          return prev.map((it) => (it.code === saved.code ? saved : it));
        }
        return [...prev, saved];
      });

      setFilteredItems((prev) => {
        const exists = prev.some((it) => it.code === saved.code);
        if (exists) {
          return prev.map((it) => (it.code === saved.code ? saved : it));
        }
        return [...prev, saved];
      });

      setShowForm(false);
    } catch (err) {
      console.error("Error creating item:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to create item");
    }
  };

  // Search filter
  const handleSearch = (query) => {
    if (!query) {
      setFilteredItems(items);
      return;
    }
    const lower = query.toLowerCase();
    setFilteredItems(
      items.filter(
        (it) =>
          it.code?.toLowerCase().includes(lower) ||
          it.category?.toLowerCase().includes(lower) ||
          it.description?.toLowerCase().includes(lower) ||
          it.plantName?.toLowerCase().includes(lower) ||
          it.remarks?.toLowerCase().includes(lower)
      )
    );
  };

  // Fetch history (stock + suppliers + sub→user)
  const fetchHistory = async (code) => {
    try {
      const res = await API.get(`/items/${code}/history`);
      const billsRes = await API.get(
        `/issue-bills?itemCode=${code}&type=SUB_TO_USER`
      );

      setHistoryData((prev) => ({
        ...prev,
        [code]: {
          stock: res.data.history || [],
          suppliers: res.data.suppliers || [],
          supplierHistory: res.data.supplierHistory || [],
          subToUserBills: billsRes.data || [],
        },
      }));
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  // Toggle history row
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
        {/* header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-3">
            <button
              onClick={() => setShowSearch((prev) => !prev)}
              className="px-4 py-2 rounded-lg bg-gray-600 text-white shadow hover:bg-gray-700 transition font-medium"
            >
              🔍 Search
            </button>

            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 transition font-medium"
            >
              ➕ Add Item
            </button>

            <Link
              href="/items/edit"
              className="px-4 py-2 rounded-lg bg-green-600 text-white shadow hover:bg-green-700 transition font-medium"
            >
              ✏️ Edit Items
            </Link>
          </div>
        </div>

        {/* Search */}
        {showSearch && (
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} />
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center h-80">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-y-auto max-h-[600px]">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-blue-700 to-blue-600 text-white text-xs uppercase sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Sr No</th>
                    <th className="px-6 py-3 text-left font-semibold">Code</th>
                    <th className="px-6 py-3 text-left font-semibold">Category</th>
                    <th className="px-6 py-3 text-left font-semibold">Description</th>
                    <th className="px-6 py-3 text-left font-semibold">Plant</th>
                    <th className="px-6 py-3 text-left font-semibold">Weight</th>
                    <th className="px-6 py-3 text-left font-semibold">UOM</th>
                    <th className="px-6 py-3 text-left font-semibold">Quantity</th>
                    <th className="px-6 py-3 text-left font-semibold">Main Store</th>
                    <th className="px-6 py-3 text-left font-semibold">Sub Store</th>
                    <th className="px-6 py-3 text-left font-semibold">Remarks</th>
                    <th className="px-6 py-3 text-left font-semibold">History</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredItems.map((item, index) => (
                    <React.Fragment key={item._id || item.code || index}>
                      <tr
                        onClick={() => {
                          const { _id, __v, ...rest } = item;
                          setSelectedItem(rest);
                          fetchHistory(item.code);
                        }}
                        className="hover:bg-blue-50 transition duration-150 cursor-pointer"
                      >
                        <td className="px-6 py-3 font-semibold text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-3 font-semibold text-blue-700">
                          {item.code || "-"}
                        </td>
                        <td className="px-6 py-3 capitalize text-gray-700">
                          {item.category}
                        </td>
                        <td className="px-6 py-3 max-w-[250px] truncate text-gray-600">
                          {item.description}
                        </td>
                        <td className="px-6 py-3 text-gray-600">
                          {item.plantName || "-"}
                        </td>
                        <td className="px-6 py-3 text-gray-600">
                          {item.weight || "-"}
                        </td>
                        <td className="px-6 py-3 text-gray-600">
                          {item.unit || "-"}
                        </td>

                        {/* Quantity with Low Stock Highlight */}
                        <td
                          className={`px-6 py-3 font-medium ${
                            item.closingQty < LOW_STOCK_THRESHOLD
                              ? "text-red-600 font-bold"
                              : "text-gray-800"
                          }`}
                        >
                          {item.closingQty || "-"}
                          {item.closingQty < LOW_STOCK_THRESHOLD && (
                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700 font-medium">
                              Low
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-3">{item.mainStoreQty || 0}</td>
                        <td className="px-6 py-3">{item.subStoreQty || 0}</td>
                        <td className="px-6 py-3 text-gray-500 italic">
                          {item.remarks || "-"}
                        </td>
                        <td
                          className="px-6 py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => toggleHistory(item.code)}
                            className="text-blue-600 hover:underline text-sm font-medium"
                          >
                            {expandedRow === item.code ? "Hide" : "View"}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded History */}
                      {expandedRow === item.code && (
                        <tr className="bg-gray-50">
                          <td colSpan="12" className="px-6 py-6 space-y-6 rounded-b-lg shadow-inner">
                            <StockHistoryTable
                              stock={historyData[item.code]?.stock || []}
                            />

                            <SupplierHistoryTable
                              supplierHistory={
                                historyData[item.code]?.supplierHistory || []
                              }
                            />

                            <SubToUserHistoryTable
                              bills={
                                historyData[item.code]?.subToUserBills || []
                              }
                              itemId={item._id}
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

      {/* Add Modal */}
      {showForm && (
        <AddItemForm
          existingClosingQty={selectedItem?.closingQty || 0}
          onClose={() => setShowForm(false)}
          onSave={handleSaveItem}
        />
      )}

      {/* Item Modal */}
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          historyData={
            historyData[selectedItem.code] || {
              stock: [],
              supplierHistory: [],
            }
          }
          onClose={() => setSelectedItem(null)}
          onSave={async (updated) => {
            const { _id, __v, ...clean } = updated;
            setItems((prev) =>
              prev.map((it) => (it.code === clean.code ? clean : it))
            );
            setFilteredItems((prev) =>
              prev.map((it) => (it.code === clean.code ? clean : it))
            );
            await fetchHistory(clean.code);
          }}
        />
      )}
    </div>
  );
}
