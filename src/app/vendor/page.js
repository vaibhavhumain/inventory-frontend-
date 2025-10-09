"use client";
import { useEffect, useState } from "react";
import API from "../../../utils/api";
import Navbar from "../../../components/Navbar";
import BackButton from "../../../components/BackButton";
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
    <div className="min-h-screen bg-gray-50">
          {/* ✅ Combined Navbar + Page Header */}
          <div className="bg-white shadow sticky top-0 z-20">
            <Navbar />
            <div>
            <BackButton />
            </div>
            <div className="px-8 py-4 border-t border-gray-200 flex justify-center">

            </div>
          </div>
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
