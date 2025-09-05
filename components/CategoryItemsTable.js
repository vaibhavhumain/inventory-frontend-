"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Package } from "lucide-react";

export default function CategoryItemsTable({ items }) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Filtered items
  const filteredItems = items.filter(
    (item) => !selectedCategory || item.category === selectedCategory
  );

  // Unique categories
  const categories = [...new Set(items.map((item) => item.category))];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header with toggle */}
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

      {/* Dropdown content */}
      {open && (
        <div className="p-5 space-y-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Category
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    #
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Description
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-700">
                    Main Store Qty
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-700">
                    Sub Store Qty
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-700">
                    Closing Qty
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-700">
                    Unit
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <tr
                      key={item._id || index}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition-colors`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-700">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-gray-800">{item.code}</td>
                      <td className="px-4 py-3 text-gray-600">{item.category}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {item.description || "-"}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {item.mainStoreQty || 0}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {item.subStoreQty || 0}
                      </td>
                      <td
                        className={`px-4 py-3 text-center font-semibold ${
                          (item.closingQty || 0) < 10
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {item.closingQty || 0}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {item.unit || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-6 text-center text-gray-500 italic"
                    >
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
