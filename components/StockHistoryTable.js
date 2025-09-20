"use client";
import React from "react";

export default function SupplierHistoryTable({ supplierHistory }) {
  if (!supplierHistory || supplierHistory.length === 0) {
    return (
      <p className="text-center text-gray-500 italic">
        No supplier history available.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border rounded-lg">
        <thead className="bg-gray-200 text-gray-700 text-xs uppercase">
          <tr>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Invoice No</th>
            <th className="px-4 py-2 text-left">Supplier</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-right">Qty</th>
            <th className="px-4 py-2 text-right">Rate</th>
            <th className="px-4 py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {supplierHistory.map((h, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-4 py-2">
                {new Date(h.date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-blue-600">{h.invoiceNumber}</td>
              <td className="px-4 py-2">{h.supplierName}</td>
              <td className="px-4 py-2">{h.description}</td>
              <td className="px-4 py-2 text-right">{h.quantity}</td>
              <td className="px-4 py-2 text-right">₹{h.rate}</td>
              <td className="px-4 py-2 text-right font-semibold">₹{h.amount}</td>
            </tr>
          ))}

          <tr className="bg-gray-100 font-semibold">
            <td colSpan="6" className="px-4 py-2 text-right">
              Total →
            </td>
            <td className="px-4 py-2 text-right text-blue-700">
              ₹
              {supplierHistory.reduce(
                (sum, h) => sum + (h.amount || 0),
                0
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
