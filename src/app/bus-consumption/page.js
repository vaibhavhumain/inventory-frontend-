"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import Navbar from "../../../components/Navbar";
import API from "../../../utils/api";

export default function BusConsumptionHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
                <tr className="bg-green-700 text-white text-xs uppercase">
                  <th className="border px-3 py-2 w-[120px]">Bus Code</th>
                  <th className="border px-3 py-2 w-[140px]">Issued To</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? (
                  history.map((bus, index) => {
                    // ✅ show first issueBill (or "-" if none)
                    const firstIssue = bus.issueBills?.[0] || {};
                    return (
                      <tr
                        key={bus._id}
                        onClick={() => router.push(`/bus-consumption/${bus._id}`)} 
                        className={`cursor-pointer ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-blue-100 transition`}
                      >
                        <td className="border px-3 py-2 font-medium text-gray-700 text-center">
                          {bus.busCode}
                        </td>
                        <td className="border px-3 py-2 text-center">
                          {firstIssue.issuedTo || "-"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="4"
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
