"use client";
import { useEffect, useState } from "react";
import API from "../../../utils/api";
export default function VendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVendors() {
      try {
        const res = await API.get("/vendors");
        setVendors(res.data);
      } catch (err) {
        console.error("Error fetching vendors:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchVendors();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Vendors
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading vendors...</p>
      ) : vendors.length === 0 ? (
        <p className="text-center text-gray-500">No vendors found.</p>
      ) : (
        <table className="w-full border-collapse border shadow bg-white">
          <thead className="bg-gray-100">
            <tr>
              {["S.No.", "Code", "Name", "GST Number", "Address"].map(
                (head) => (
                  <th
                    key={head}
                    className="border px-4 py-2 text-left font-semibold"
                  >
                    {head}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {vendors.map((v, index) => (
              <tr key={v._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{v.code || "—"}</td>
                <td className="border px-4 py-2">{v.name}</td>
                <td className="border px-4 py-2">{v.gstNumber || "No GST"}</td>
                <td className="border px-4 py-2">{v.address || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
