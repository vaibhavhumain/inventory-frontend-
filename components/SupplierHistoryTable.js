"use client";
import React from "react";

export default function SupplierHistoryTable({ supplierHistory = [] }) {
  if (!supplierHistory.length) {
    return (
      <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-500 italic">
        No supplier history available.
      </div>
    );
  }

  // ✅ Calculate total amount
  const totalAmount = supplierHistory.reduce(
    (sum, s) => sum + (s.amount || 0),
    0
  );

  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-3 text-lg flex items-center gap-2">
        🏭 Supplier History
      </h3>
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gradient-to-r from-purple-600 to-purple-500 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">Supplier</th>
              <th className="px-4 py-3 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {supplierHistory.map((s, i) => (
              <tr key={i} className="hover:bg-purple-50 transition duration-150">
                <td className="px-4 py-2 text-gray-700">
                  {new Date(s.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-gray-700 font-medium">
                  {s.supplierName}
                </td>
                <td className="px-4 py-2 text-right text-gray-900 font-semibold">
                  ₹{s.amount?.toLocaleString() || 0}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100">
              <td colSpan="2" className="px-4 py-3 text-right font-semibold">
                Total →
              </td>
              <td className="px-4 py-3 text-right font-bold text-purple-700">
                ₹{totalAmount.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
