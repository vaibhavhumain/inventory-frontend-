"use client";
import React from "react";

export default function StockHistoryTable({ stock = [] }) {
  if (!stock.length) {
    return (
      <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-500 italic">
        No stock history available.
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-3 text-lg flex items-center gap-2">
        📊 Stock History
      </h3>
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gradient-to-r from-green-600 to-green-500 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">In</th>
              <th className="px-4 py-3 text-left font-medium">Out</th>
              <th className="px-4 py-3 text-left font-medium">Closing Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {stock.map((h, i) => (
              <tr key={i} className="hover:bg-green-50 transition duration-150">
                <td className="px-4 py-2 text-gray-700">
                  {new Date(h.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-green-600 font-semibold">
                  {h.in}
                </td>
                <td className="px-4 py-2 text-red-600 font-semibold">
                  {h.out}
                </td>
                <td className="px-4 py-2 text-gray-900 font-bold">
                  {h.closingQty}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
