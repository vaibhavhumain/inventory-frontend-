"use client";
import { useEffect, useState } from "react";
import API from "../utils/api";

export default function ItemLedgerTable({ itemId }) {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!itemId) return;
    API.get(`/items/${itemId}/ledger`)
      .then((res) => setLedger(res.data.ledger || []))
      .catch((err) => console.error("Error loading ledger:", err))
      .finally(() => setLoading(false));
  }, [itemId]);

  const tableClass =
    "w-full border text-xs border-collapse table-fixed";
  const thClass =
    "border px-2 py-2 bg-gray-100 text-gray-700 font-semibold text-center";
  const tdClass = "border px-2 py-2 text-center";

  if (loading) {
    return <p className="text-gray-500 italic">Loading ledger...</p>;
  }

  if (!ledger.length) {
    return <p className="text-gray-500 italic">No ledger data</p>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <h2 className="font-semibold text-gray-700 mb-3">
        Stock Ledger (Per Day)
      </h2>
      <div className="overflow-x-auto">
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>Date</th>
              <th className={thClass}>Opening (Main)</th>
              <th className={thClass}>Opening (Sub)</th>
              <th className={thClass}>Opening Total</th>
              <th className={thClass}>Opening Amount</th>
              <th className={thClass}>Purchase Qty</th>
              <th className={thClass}>Purchase Amt</th>
              <th className={thClass}>Issue Qty</th>
              <th className={thClass}>Issue Amt</th>
              <th className={thClass}>Consumption Qty</th>
              <th className={thClass}>Consumption Amt</th>
              <th className={thClass}>Sale Qty</th>
              <th className={thClass}>Sale Amt</th>
              <th className={thClass}>Closing (Main)</th>
              <th className={thClass}>Closing (Sub)</th>
              <th className={thClass}>Closing Total</th>
              <th className={thClass}>Closing Amount</th>
            </tr>
          </thead>
          <tbody>
            {ledger.map((row, i) => (
              <tr
                key={i}
                className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-yellow-50`}
              >
                <td className={tdClass}>{row.date}</td>
                <td className={tdClass}>{row.openingMain}</td>
                <td className={tdClass}>{row.openingSub}</td>
                <td className={tdClass}>{row.openingTotal}</td>
                <td className={tdClass}>₹{row.openingAmount}</td>
                <td className={tdClass}>{row.purchaseQty}</td>
                <td className={tdClass}>₹{row.purchaseAmt}</td>
                <td className={tdClass}>{row.issueQty}</td>
                <td className={tdClass}>₹{row.issueAmt}</td>
                <td className={tdClass}>{row.consumptionQty}</td>
                <td className={tdClass}>₹{row.consumptionAmt}</td>
                <td className={tdClass}>{row.saleQty}</td>
                <td className={tdClass}>₹{row.saleAmt}</td>
                <td className={tdClass}>{row.closingMain}</td>
                <td className={tdClass}>{row.closingSub}</td>
                <td className={tdClass}>{row.closingTotal}</td>
                <td className={tdClass}>₹{row.closingAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
