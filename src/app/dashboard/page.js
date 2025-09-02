'use client';
import Link from "next/link";
import RequireAuth from "../../../components/RequireAuth";
import ExportForm from "../../../components/ExportForm";
import { clearAuth, getUser } from "../../../utils/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import { PlusCircle, MinusCircle, FileSpreadsheet, AlertTriangle } from "lucide-react"; // ✅ icons
import API from "../../../utils/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ loading state
  const [lowStockItems, setLowStockItems] = useState([]);

  const LOW_STOCK_THRESHOLD = 10;

  useEffect(() => {
    setUser(getUser());
    fetchLowStock();
  }, []);

  const logout = () => {
    clearAuth();
    router.push("/login");
  };

  // ✅ fetch low stock items
  const fetchLowStock = async () => {
    try {
      const res = await API.get("/items");
      const lowItems = res.data.filter((it) => it.closingQty < LOW_STOCK_THRESHOLD);
      setLowStockItems(lowItems);
    } catch (err) {
      console.error("Error fetching low stock:", err);
    }
  };

  // ✅ Custom navigation with loading spinner
  const handleNavigation = (href) => {
    setLoading(true);
    router.push(href);
  };

  return (
    <RequireAuth>
      <Navbar />

      {/* ✅ Fullscreen Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              📦 Inventory Dashboard
            </h1>
            <p className="text-gray-500 mt-2">
              Manage your stock, record issues, and export reports seamlessly.
            </p>
          </div>

          {/* Low Stock Alert Banner */}
          {lowStockItems.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg shadow flex items-center gap-2">
              <AlertTriangle className="text-red-600" size={20} />
              <span>
                ⚠️ Low stock alert for:{" "}
                {lowStockItems.map((it) => it.code).join(", ")}
              </span>
            </div>
          )}

          {/* Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Feed Stock */}
            <button
              onClick={() => handleNavigation("/feed")}
              className="group block w-full text-left bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 p-8 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition">
                <PlusCircle size={28} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-800">
                Feed Stock
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Add incoming materials to inventory.
              </p>
            </button>

            {/* Issue Stock */}
            <button
              onClick={() => handleNavigation("/issue")}
              className="group block w-full text-left bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 p-8 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white transition">
                <MinusCircle size={28} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-800">
                Issue Stock
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Record issued items with details.
              </p>
            </button>

            {/* Export Report */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 p-8 transition-all duration-300">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                <FileSpreadsheet size={28} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-800">
                Export Report
              </h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">
                Download Excel by date or custom range.
              </p>
              <ExportForm />
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
