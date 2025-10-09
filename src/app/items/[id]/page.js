"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "../../../../utils/api";
import ItemLedgerTable from "../../../../components/ItemLedgerTable";

export default function ItemOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id;

  const [data, setData] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullHistory, setShowFullHistory] = useState(false);

  useEffect(() => {
    if (!itemId) return;

    // Fetch overview + ledger together
    Promise.all([
      API.get(`/items/${itemId}/overview`),
      API.get(`/items/${itemId}/ledger`),
    ])
      .then(([overviewRes, ledgerRes]) => {
        setData(overviewRes.data);
        setLedger(ledgerRes.data.ledger || []);
      })
      .catch((err) => console.error("Error loading item overview:", err))
      .finally(() => setLoading(false));
  }, [itemId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  if (!data) return <div className="p-6">No data</div>;

  const { item, purchaseHistory = [] } = data;

  // ✅ Latest closing values from ledger
  const latestLedger = ledger.length ? ledger[ledger.length - 1] : {};
  const mainQty = latestLedger?.closingMain || 0;
  const subQty = latestLedger?.closingSub || 0;
  const totalQty = latestLedger?.closingTotal || mainQty + subQty;

  // ✅ Show only 3 latest purchase entries by default
  const visibleHistory = showFullHistory
    ? purchaseHistory
    : purchaseHistory.slice(0, 1);

  const tableClass = "w-full border text-xs border-collapse table-fixed";
  const thClass =
    "border px-2 py-2 bg-gray-100 text-gray-700 font-semibold text-center";
  const tdClass = "border px-2 py-2 text-center";

  return (
    <div className="bg-gray-50 min-h-screen p-6 text-sm">
      {/* Back Button */}
      <button
        onClick={() => router.push("/items")}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        ← Back to Items
      </button>

      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-6 grid grid-cols-3 gap-6">
        <div className="flex flex-col items-start justify-center">
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            {item.headDescription}
          </h1>
          <p className="text-gray-600">Group: {item.category}</p>
          <p>
            <span className="font-semibold text-indigo-600">Total Qty:</span>{" "}
            {totalQty} {item.unit}
          </p>
          <p>
            <span className="font-semibold">HSN Code:</span>{" "}
            {item.hsnCode || "-"}
          </p>
        </div>
      </div>

      {/* Purchase History (Fresh + Expandable) */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-700">
            Purchase History ({showFullHistory ? "Detailed" : "Recent"})
          </h2>
          {purchaseHistory.length > 1 && (
            <button
              onClick={() => setShowFullHistory(!showFullHistory)}
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              {showFullHistory ? "Hide Details ▲" : "View Detailed History ▼"}
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>Date</th>
                <th className={thClass}>Invoice</th>
                <th className={thClass}>Vendor</th>
                <th className={thClass}>Qty</th>
                <th className={thClass}>Rate</th>
                <th className={thClass}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {visibleHistory.length > 0 ? (
                visibleHistory.map((inv, i) =>
                  inv.items
                    .filter((it) => it.item?._id?.toString() === itemId)
                    .map((it, j) => (
                      <tr key={`${i}-${j}`} className="hover:bg-yellow-50">
                        <td className={tdClass}>
                          {new Date(inv.date).toLocaleDateString("en-IN")}
                        </td>
                        <td className={tdClass}>{inv.invoiceNumber}</td>
                        <td className={tdClass}>{inv.vendor?.name}</td>
                        <td className={tdClass}>{it.subQuantity}</td>
                        <td className={tdClass}>₹{it.rate}</td>
                        <td className={tdClass}>₹{it.amount}</td>
                      </tr>
                    ))
                )
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-gray-500 italic">
                    No purchase history
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Hint when collapsed */}
        {!showFullHistory && purchaseHistory.length > 3 && (
          <p className="text-xs text-gray-500 italic mt-2">
            Showing last 3 entries. Click “View Detailed History” to see all.
          </p>
        )}
      </div>

      {/* ✅ Ledger Table */}
      <ItemLedgerTable itemId={itemId} />

      {/* ✅ Stock Summary */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="font-semibold text-gray-700 mb-2">Stock Summary</h2>
          <p>Main Store: {mainQty} {item.unit}</p>
          <p>Sub-Store: {subQty} {item.unit}</p>
          <p className="font-medium text-blue-700 mt-1">
            Total: {totalQty} {item.unit}
          </p>
          <p className="text-gray-500 text-xs mt-1">Location: Main & Sub Store</p>
        </div>
      </div>
    </div>
  );
}
