"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import API from "../../../../utils/api";

export default function BusConsumptionDetailPage() {
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Date filter state
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading details...</p>;

  if (!bus)
    return (
      <p className="text-center mt-10 text-gray-500 italic">
        No details found
      </p>
    );

  const allBills = bus.issueBills || [];

  // 🔹 Apply date filtering
  const filteredBills = allBills.filter((bill) => {
    const billDate = new Date(bill.issueDate).toISOString().split("T")[0];
    const fromOk = fromDate ? billDate >= fromDate : true;
    const toOk = toDate ? billDate <= toDate : true;
    return fromOk && toOk;
  });

  // 🔹 Calculate totals
  const totalQuantity = filteredBills.reduce(
    (sum, bill) =>
      sum +
      bill.items.reduce((s, it) => s + (Number(it.quantity) || 0), 0),
    0
  );
  const totalAmount = filteredBills.reduce(
    (sum, bill) =>
      sum +
      bill.items.reduce((s, it) => s + (Number(it.amount) || 0), 0),
    0
  );

  return (
    <div className="min-h-screen bg-white px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => history.back()}
        className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 
                   rounded-md shadow-sm text-gray-700 hover:bg-gray-100 transition"
      >
        ← Back
      </button>

      {/* Title */}
      <h2 className="text-3xl font-bold text-blue-700 mb-8 border-b-2 border-blue-600 pb-2">
        Bus Consumption Report
      </h2>

      {/* === Filter Section === */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-700">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="ml-2 border rounded-md px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="ml-2 border rounded-md px-2 py-1 text-sm"
          />
        </div>
        <button
          onClick={() => {
            setFromDate("");
            setToDate("");
          }}
          className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded-md"
        >
          Reset
        </button>
      </div>

      {/* === Header Table === */}
      <table className="w-full border border-gray-400 mb-6 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">Bus Code</th>
            <th className="border px-3 py-2 text-left">Chassis No</th>
            <th className="border px-3 py-2 text-left">Engine No</th>
            <th className="border px-3 py-2 text-left">Customer Name</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-yellow-100 font-medium">
            <td className="border px-3 py-2">{bus.busCode || "-"}</td>
            <td className="border px-3 py-2">{bus.chassisNo || "-"}</td>
            <td className="border px-3 py-2">{bus.engineNo || "-"}</td>
            <td className="border px-3 py-2">{bus.ownerName || "-"}</td>
          </tr>
        </tbody>
      </table>

      {/* === Items Table === */}
      <table className="w-full border border-gray-400 text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-800 font-semibold">
            <th className="border px-3 py-2 text-left w-[120px]">Date</th>
            <th className="border px-3 py-2 text-left">Item Code–Description</th>
            <th className="border px-3 py-2 text-center w-[100px]">Quantity</th>
            <th className="border px-3 py-2 text-center w-[100px]">Rate</th>
            <th className="border px-3 py-2 text-center w-[120px]">Amount</th>
          </tr>
        </thead>

        <tbody>
          {filteredBills.length > 0 ? (
            filteredBills.flatMap((bill) =>
              bill.items.map((it, i) => (
                <tr key={`${bill._id}-${i}`} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">
                    {bill.issueDate
                      ? new Date(bill.issueDate).toLocaleDateString("en-IN")
                      : "-"}
                  </td>
                  <td className="border px-3 py-2">
                    {`${it.code || "-"} ${it.description || ""}`}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {it.quantity} {it.uqc || "pcs"}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    ₹{Number(it.rate || 0).toFixed(2)}
                  </td>
                  <td className="border px-3 py-2 text-right font-medium text-green-700">
                    ₹{Number(it.amount || 0).toFixed(2)}
                  </td>
                </tr>
              ))
            )
          ) : (
            <tr>
              <td
                colSpan="5"
                className="border px-3 py-4 text-center text-gray-500 italic"
              >
                No items consumed in selected range
              </td>
            </tr>
          )}

          {/* === Summary Row (Totals) === */}
          {filteredBills.length > 0 && (
            <tr className="bg-gray-100 font-semibold">
              <td colSpan="2" className="border px-3 py-2 text-right">
                Total
              </td>
              <td className="border px-3 py-2 text-center">{totalQuantity}</td>
              <td className="border px-3 py-2 text-center">—</td>
              <td className="border px-3 py-2 text-right text-green-700">
                ₹{totalAmount.toFixed(2)}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
