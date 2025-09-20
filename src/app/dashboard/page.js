"use client";
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
  Users,
  FileText,
  LayoutDashboard,
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
      const lowItems = res.data.filter(
        (it) => it.closingQty < LOW_STOCK_THRESHOLD
      );
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
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white flex flex-col">
          <div className="p-6 text-2xl font-bold border-b border-blue-600">
            InveTrack
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => handleNavigation("/dashboard")}
              className="flex items-center gap-3 px-4 py-2 w-full rounded-lg hover:bg-blue-600 transition"
            >
              <LayoutDashboard size={20} /> Dashboard
            </button>
            <button
              onClick={() => handleNavigation("/vendor")}
              className="flex items-center gap-3 px-4 py-2 w-full rounded-lg hover:bg-blue-600 transition"
            >
              <Users size={20} /> Vendors
            </button>
            <button
              onClick={() => handleNavigation("/invoices")}
              className="flex items-center gap-3 px-4 py-2 w-full rounded-lg hover:bg-blue-600 transition"
            >
              <FileText size={20} /> Invoices
            </button>
            <button
              onClick={() => handleNavigation("/low-stock")}
              className="flex items-center gap-3 px-4 py-2 w-full rounded-lg hover:bg-blue-600 transition"
            >
              <AlertTriangle size={20} /> Low Stock
            </button>
          </nav>
          <div className="p-4 border-t border-blue-600">
            <button
              onClick={logout}
              className="w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Navbar />

          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <main className="flex-1 bg-gray-50 p-8 overflow-y-auto">
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
                    <p className="text-xl font-bold text-gray-800">
                      {totalItems}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                    <AlertTriangle size={28} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Low Stock Items</p>
                    <p className="text-xl font-bold text-gray-800">
                      {lowStockItems.length}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-100 text-green-600">
                    <Layers size={28} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Threshold</p>
                    <p className="text-xl font-bold text-gray-800">
                      &lt; {LOW_STOCK_THRESHOLD}
                    </p>
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
                  <h3 className="mt-5 text-lg font-semibold text-gray-800">
                    Feed Stock
                  </h3>
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
                  <h3 className="mt-5 text-lg font-semibold text-gray-800">
                    Issue Stock
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Record issued items with details.
                  </p>
                </button>

                <ExportForm />
              </div>

              {/* Table */}
              <div className="px-6 py-4">
                <CategoryItemsTable
                  items={items}
                  selectedCategory={selectedCategory}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </RequireAuth>
  );
}
