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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!itemId) return;
    API.get(`/items/${itemId}/overview`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error loading overview:", err))
      .finally(() => setLoading(false));
  }, [itemId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  if (!data) return <div className="p-6">No data</div>;

  const {
    item,
    vendors,
    stock,
    purchaseHistory,
  } = data;

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
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            {item.headDescription}
          </h1>
          <p className="text-gray-600">Group: {item.category}</p>
          <p className="font-medium text-blue-600">
            Closing Balance: {stock.currentStock} {item.unit}
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Cost Price:</span>{" "}
            {vendors.length > 0 ? `₹${vendors[0].avgRate?.toFixed(2)}` : "-"}
          </p>
          <p>
            <span className="font-semibold">Avg. Cost:</span>{" "}
            {vendors.length > 0 ? `₹${vendors[0].avgRate?.toFixed(2)}` : "-"}
          </p>
          <p>
            <span className="font-semibold">Standard Cost:</span> –
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Part No:</span> –
          </p>
          <p>
            <span className="font-semibold">HSN Code:</span>{" "}
            {item.hsnCode || "-"}
          </p>
          <p>
            <span className="font-semibold">Remarks:</span>{" "}
            {item.remarks || "-"}
          </p>
        </div>
      </div>

      {/* Detailed Purchase History */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-gray-700 mb-3">
          Purchase History (Detailed)
        </h2>
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
              {purchaseHistory?.length > 0 ? (
                purchaseHistory.map((inv, i) =>
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
      </div>

      {/* ✅ Ledger Table */}
      <ItemLedgerTable itemId={itemId} />

      {/* Bottom: Location + Category */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="font-semibold text-gray-700 mb-2">Location / Batch</h2>
          <p>Location: Main Store</p>
          <p>
            Quantity: {stock.currentStock} {item.unit}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="font-semibold text-gray-700 mb-2">
            Items of Same Category
          </h2>
          <p className="text-gray-600">
            (Later you can load from backend: all items where category ={" "}
            {item.category})
          </p>
        </div>
      </div>
    </div>
  );
}
