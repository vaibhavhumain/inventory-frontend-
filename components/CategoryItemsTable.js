"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import API from "../utils/api";

export default function CategoryItemsTable() {
  const [open, setOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter(
    (item) => !selectedCategory || item.hsnCode === selectedCategory
  );

  const categories = [...new Set(items.map((item) => item.hsnCode))];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden w-full">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 py-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition text-left font-semibold text-gray-800"
      >
        <span className="flex items-center gap-2">
          <Package className="text-blue-600" size={20} />
          {selectedCategory ? `${selectedCategory} Items` : "All Items"}
          <span className="ml-2 text-sm text-gray-500">
            ({filteredItems.length})
          </span>
        </span>
        {open ? (
          <ChevronUp className="text-gray-600" />
        ) : (
          <ChevronDown className="text-gray-600" />
        )}
      </button>

      {open && (
        <div className="p-5 space-y-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by HSN Code
            </label>
            <select
              onChange={(e) => setSelectedCategory(e.target.value)}
              value={selectedCategory}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none inline-block"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Items Table */}
          {loading ? (
            <p className="text-center text-gray-500">Loading items...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-fixed">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 w-[60px]">S.No</th>
                    <th className="px-4 py-3 w-[100px]">Item</th>
                    <th className="px-4 py-3 w-[150px]">Description</th>
                    <th className="px-4 py-3 w-[100px]">Head Qty</th>
                    <th className="px-4 py-3 w-[100px]">Head UOM</th>
                    <th className="px-4 py-3 w-[100px]">Sub Qty</th>
                    <th className="px-4 py-3 w-[100px]">Sub UOM</th>
                    <th className="px-4 py-3 w-[120px]">HSN Code</th>
                    <th className="px-4 py-3 w-[100px]">Rate</th>
                    <th className="px-4 py-3 w-[100px]">Amount</th>
                    <th className="px-4 py-3 w-[80px]">GST %</th>
                    <th className="px-4 py-3 w-[120px]">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((it, index) => (
                      <tr
                        key={`${it.item}-${index}`}
                        className="hover:bg-blue-50 transition duration-150"
                      >
                        <td className="px-4 py-2 text-center">{index + 1}</td>
                        <td className="px-4 py-2 font-semibold text-blue-700">
                          {it.item}
                        </td>
                        <td className="px-4 py-2">{it.description || "-"}</td>
                        <td className="px-4 py-2 text-center">
                          {it.headQuantity}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {it.headQuantityMeasurement}
                        </td>
                        <td className="px-4 py-2 text-center">{it.subQuantity}</td>
                        <td className="px-4 py-2 text-center">
                          {it.subQuantityMeasurement}
                        </td>
                        <td className="px-4 py-2 text-center">{it.hsnCode}</td>
                        <td className="px-4 py-2 text-right">{it.rate}</td>
                        <td className="px-4 py-2 text-right">{it.amount}</td>
                        <td className="px-4 py-2 text-center">{it.gstRate}</td>
                        <td className="px-4 py-2 text-center">{it.location}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="12"
                        className="px-4 py-6 text-center text-gray-500 italic"
                      >
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
