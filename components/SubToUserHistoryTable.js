"use client";
import React from "react";

export default function SubToUserHistoryTable({ bills = [], itemId }) {
  if (!bills.length) {
    return (
      <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-500 italic">
        No Sub → User history available.
      </div>
    );
  }

  const totalQty = bills.reduce((sum, bill) => {
    const entry = bill.items.find((b) => b.item?._id === itemId);
    return sum + (entry?.quantity || 0);
  }, 0);

  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-3 text-lg flex items-center gap-2">
        📜 Sub → User History
      </h3>
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">Issued To</th>
              <th className="px-4 py-3 text-left font-medium">Issued By</th>
              <th className="px-4 py-3 text-center font-medium w-24">Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {bills.map((bill, i) => {
              const entry = bill.items.find((b) => b.item?._id === itemId);
              return (
                <tr
                  key={i}
                  className="hover:bg-blue-50 transition duration-150"
                >
                  <td className="px-4 py-2 text-gray-700">
                    {new Date(bill.issueDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-gray-700 font-medium">
                    {bill.issuedTo || "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-600">{bill.issuedBy}</td>
                  <td className="px-4 py-2 text-center text-blue-700 font-semibold">
                    {entry?.quantity || 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100">
              <td colSpan="3" className="px-4 py-3 text-right font-semibold">
                Total Issued →
              </td>
              <td className="px-4 py-3 text-center font-bold text-blue-700">
                {totalQty}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
