"use client";
import { useEffect, useState } from "react";
import API from "../../../utils/api";
import Navbar from "../../../components/Navbar";

export default function IssueBillsPage() {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [filterType, setFilterType] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await API.get("/issue-bills");
        setBills(res.data);
        setFilteredBills(res.data);
      } catch (err) {
        console.error("Error fetching issue bills:", err);
        setError("Failed to load issue bills");
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  // 🔹 Filter by type
  const handleFilterChange = (type) => {
    setFilterType(type);
    if (type === "ALL") setFilteredBills(bills);
    else setFilteredBills(bills.filter((b) => b.type === type));
  };

  // 🔹 Determine if we are viewing only MAIN_TO_SUB type
  const hideColumns = filterType === "MAIN_TO_SUB";
  const hideColumns2 = filterType === "SUB_TO_SALE";
  return (
    <div>
      <Navbar />
      <div className="max-w-[95%] mx-auto mt-8 bg-white border rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Issue Bills History</h1>
          <select
            value={filterType}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="ALL">All Types</option>
            <option value="MAIN_TO_SUB">Main → Sub</option>
            <option value="SUB_TO_USER">Sub → User</option>
            <option value="SUB_TO_SALE">Sub → Sale</option>
          </select>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-6">Loading issue bills...</p>
        ) : error ? (
          <p className="text-center text-red-500 py-6">{error}</p>
        ) : filteredBills.length === 0 ? (
          <p className="text-center text-gray-500 italic py-6">
            No issue bills found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-100 text-gray-700 font-semibold">
                <tr>
                  <th className="border px-3 py-2 text-center">#</th>
                  <th className="border px-3 py-2 text-left">Date</th>
                  <th className="border px-3 py-2 text-left">Department</th>
                  <th className="border px-3 py-2 text-left">Type</th>

                  {/* Conditionally render Issued To column */}
                  {!hideColumns && (
                    <th className="border px-3 py-2 text-left">Issued To</th>
                  )}

                  <th className="border px-3 py-2 text-left">Items</th>
                  <th className="border px-3 py-2 text-right">Total Amount</th>
                  <th className="border px-3 py-2 text-left">Issued By</th>

                  {/* Conditionally render Bus column */}
                  {!hideColumns2 && (
                    <th className="border px-3 py-2 text-center">Bus</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredBills.map((bill, idx) => (
                  <tr
                    key={bill._id}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="border px-3 py-2 text-center">{idx + 1}</td>
                    <td className="border px-3 py-2">
                      {new Date(bill.issueDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="border px-3 py-2">{bill.department}</td>
                    <td className="border px-3 py-2">
                      {bill.type === "MAIN_TO_SUB"
                        ? "Main → Sub"
                        : bill.type === "SUB_TO_USER"
                        ? "Sub → User"
                        : "Sub → Sale"}
                    </td>

                    {/* Show Issued To only if applicable */}
                    {!hideColumns && (
                      <td className="border px-3 py-2">
                        {bill.issuedTo || "-"}
                      </td>
                    )}

                    <td className="border px-3 py-2">
                      {bill.items?.map((it, i) => (
                        <div key={i} className="text-gray-700">
                          • {it.item?.headDescription || "Item"}{" "}
                          <span className="text-gray-500">
                            ({it.quantity} × ₹{it.rate})
                          </span>
                        </div>
                      ))}
                    </td>

                    <td className="border px-3 py-2 text-right font-medium text-green-700">
                      ₹{bill.totalAmount?.toFixed(2) || "0.00"}
                    </td>

                    <td className="border px-3 py-2">
                      {bill.issuedBy?.name || "Unknown"}
                    </td>

                    {/* Show Bus only if applicable */}
                    {!hideColumns2 && (
                      <td className="border px-3 py-2 text-center">
                        {bill.bus?.busCode || "-"}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
