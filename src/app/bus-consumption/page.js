"use client";
import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import API from "../../../utils/api";

export default function BusConsumptionHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      try {
        const res = await API.get("/bus-consumption");
        setHistory(res.data);
      } catch (err) {
        console.error("Error fetching bus consumption history:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-[95%] mx-auto px-4 py-6">

        {loading ? (
          <p className="text-center text-gray-500">Loading history...</p>
        ) : (
          <div className="bg-white rounded-lg shadow border border-gray-300 overflow-x-auto">
            <table className="w-full text-sm border-collapse table-fixed">
              <thead>
                <tr className="bg-blue-700 text-white text-xs uppercase">
                  <th className="border px-3 py-2 w-[120px]">Bus Code</th>
                  <th className="border px-3 py-2 w-[140px]">Chassis No</th>
                  <th className="border px-3 py-2 w-[140px]">Engine No</th>
                  <th className="border px-3 py-2 w-[120px]">Issued By</th>
                  <th className="border px-3 py-2 w-[120px]">Issued To</th>
                  <th className="border px-3 py-2 w-[120px]">Issue Date</th>
                  <th className="border px-3 py-2 w-[320px]">Items Consumed</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? (
                  history.map((bus, index) => (
                    <tr
                      key={bus._id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100 transition`}
                    >
                      <td className="border px-3 py-2 font-medium text-blue-700 text-center">
                        {bus.busCode}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {bus.chassisNumber}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {bus.engineNumber}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {bus.issueBill?.issuedBy || "-"}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {bus.issueBill?.issuedTo || "-"}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {bus.issueBill?.issueDate
                          ? new Date(bus.issueBill.issueDate).toLocaleDateString(
                              "en-IN"
                            )
                          : "-"}
                      </td>
                      <td className="border px-3 py-2 align-top">
                        {bus.issueBill?.items?.length > 0 ? (
                          <table className="w-full text-xs border border-gray-300">
                            <thead>
                              <tr className="bg-blue-600 text-white">
                                <th className="px-2 py-1 text-left border border-gray-300">
                                  Item
                                </th>       
                                <th className="px-2 py-1 text-right border border-gray-300">
                                  Quantity
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {bus.issueBill.items.map((it, idx) => (
                                <tr
                                  key={idx}
                                  className="hover:bg-gray-50 transition"
                                >
                                  <td className="px-2 py-1 border border-gray-200">
                                    {it.item?.code || "-"}{" "}
                                    {it.item?.headDescription || ""}
                                  </td>
                                  <td className="px-2 py-1 border border-gray-200 text-right">
                                    {it.quantity} {it.item?.unit || ""}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No consumption records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
