'use client';
import Link from "next/link";
import RequireAuth from "../../../components/RequireAuth";
import ExportForm from "../../../components/ExportForm";
import { clearAuth, getUser } from "../../../utils/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import CategoryItemsTable from "../../../components/CategoryItemsTable";
import {
  PlusCircle,
  MinusCircle,
  FileSpreadsheet,
  AlertTriangle,
  Package,
  Layers,
} from "lucide-react";
import API from "../../../utils/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const LOW_STOCK_THRESHOLD = 10;

  useEffect(() => {
    setUser(getUser());
    fetchItems();
  }, []);

  const logout = () => {
    clearAuth();
    router.push("/login");
  };

  const fetchItems = async () => {
    try {
      const res = await API.get("/items");
      setItems(res.data);
      setTotalItems(res.data.length);

      // calculate low stock items
      const lowItems = res.data.filter((it) => it.closingQty < LOW_STOCK_THRESHOLD);
      setLowStockItems(lowItems);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  const handleNavigation = (href) => {
    setLoading(true);
    router.push(href);
  };

  return (
    <RequireAuth>
      <Navbar />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-8">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              📦 Inventory Dashboard
            </h1>
            <p className="text-gray-500 mt-2">
              Monitor inventory, manage stock, and export reports efficiently.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                <Package size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Items</p>
                <p className="text-xl font-bold text-gray-800">{totalItems}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                <AlertTriangle size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Low Stock Items</p>
                <p className="text-xl font-bold text-gray-800">{lowStockItems.length}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100 text-green-600">
                <Layers size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Threshold</p>
                <p className="text-xl font-bold text-gray-800">&lt; {LOW_STOCK_THRESHOLD}</p>
              </div>
            </div>
          </div>

          {/* Action Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <button
              onClick={() => handleNavigation("/feed")}
              className="group block w-full text-left bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-200 p-8 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition">
                <PlusCircle size={28} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-800">Feed Stock</h3>
              <p className="text-sm text-gray-500 mt-1">
                Add incoming materials to inventory.
              </p>
            </button>

            <button
              onClick={() => handleNavigation("/issue")}
              className="group block w-full text-left bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-200 p-8 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white transition">
                <MinusCircle size={28} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-800">Issue Stock</h3>
              <p className="text-sm text-gray-500 mt-1">
                Record issued items with details.
              </p>
            </button>

            <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-200 p-8 transition-all duration-300">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                <FileSpreadsheet size={28} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-800">Export Report</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">
                Download Excel by date or custom range.
              </p>
              <ExportForm />
            </div>
          </div>
  
            {/* Table */}
            <div className="px-6 py-4">
              <CategoryItemsTable items={items} selectedCategory={selectedCategory} />
            </div>
          </div>
        </div>
    </RequireAuth>
  );
}
