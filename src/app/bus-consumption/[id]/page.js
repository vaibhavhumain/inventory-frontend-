"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import API from "../../../../utils/api";

export default function BusConsumptionDetailPage() {
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBus() {
      setLoading(true);
      try {
        const res = await API.get(`/bus-consumption/${id}`);
        setBus(res.data);
      } catch (err) {
        console.error("Error fetching bus details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBus();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading details...</p>;
  }

  if (!bus) {
    return <p className="text-center mt-10 text-gray-500 italic">No details found</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      {/* Back Button */}
      <button
        onClick={() => history.back()}
        className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 
                   rounded-md shadow-sm text-gray-700 hover:bg-gray-100 transition"
      >
        ← Back
      </button>

      {/* Report Title */}
      <h2 className="text-3xl font-bold text-blue-700 mb-8 border-b pb-3">
        Bus Consumption Report
      </h2>

      {/* Loop through each issueBill */}
      {bus.issueBills && bus.issueBills.length > 0 ? (
        bus.issueBills.map((bill, idx) => (
          <div key={bill._id || idx} className="mb-10">
            {/* Header Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm mb-6 w-full">
              <div className="p-3 bg-white shadow-sm rounded border">
                <p className="text-gray-500">Department</p>
                <p className="font-medium text-gray-800">
                  {bill.department || "-"}
                </p>
              </div>
              <div className="p-3 bg-white shadow-sm rounded border">
                <p className="text-gray-500">Issued By</p>
                <p className="font-medium text-gray-800">
                  {bill.issuedBy || "-"}
                </p>
              </div>
              <div className="p-3 bg-white shadow-sm rounded border">
                <p className="text-gray-500">Date</p>
                <p className="font-medium text-gray-800">
                  {bill.issueDate
                    ? new Date(bill.issueDate).toLocaleDateString("en-IN")
                    : "-"}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Items Consumed
            </h3>
            {bill.items && bill.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-300">
                  <thead>
                    <tr className="bg-blue-600 text-white text-left">
                      <th className="px-3 py-2 border">Bus Code</th>
                      <th className="px-3 py-2 border">Code</th>
                      <th className="px-3 py-2 border">Description</th>
                      <th className="px-3 py-2 border">UQC</th>
                      <th className="px-3 py-2 border text-right">Quantity</th>
                      <th className="px-3 py-2 border text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bill.items.map((it, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-3 py-2 border">{bus.busCode || "-"}</td>
                        <td className="px-3 py-2 border">
                          {it.code || it.item?.code || "-"}
                        </td>
                        <td className="px-3 py-2 border">
                          {it.description || it.item?.headDescription || ""}
                        </td>
                        <td className="px-3 py-2 border">
                          {it.uqc || it.item?.unit || "-"}
                        </td>
                        <td className="px-3 py-2 border text-right">
                          {it.quantity}
                        </td>
                        <td className="px-3 py-2 border text-right">
                          ₹{it.amount || 0}
                        </td>
                      </tr>
                    ))}
                    {/* Summary Row */}
                    <tr className="font-semibold bg-gray-100">
                      <td colSpan={4} className="px-3 py-2 border text-right">
                        Total
                      </td>
                      <td className="px-3 py-2 border text-right">
                        {bill.items.reduce((sum, it) => sum + (it.quantity || 0), 0)}
                      </td>
                      <td className="px-3 py-2 border text-right">
                        ₹{bill.totalAmount || 0}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 mt-3 italic">No items recorded</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">No issue bills linked to this bus</p>
      )}
    </div>
  );
}
