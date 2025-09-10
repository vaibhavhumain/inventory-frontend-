"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../../utils/api";
import { getToken, clearAuth } from "../../../utils/auth";
import AdminNavbar from "../../../components/AdminNavbar";
export default function AdminDashboard() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  // 🔐 Verify token + role
  useEffect(() => {
    const verify = async () => {
      const token = getToken();
      if (!token) {
        router.replace("/login");
        return;
      }
      try {
        const { data } = await API.get("/auth/profile");
        if (data.role !== "admin") {
          router.replace("/dashboard");
          return;
        }
        setAuthLoading(false);
      } catch {
        clearAuth();
        router.replace("/login");
      }
    };
    verify();
  }, [router]);

  // 📊 Fetch stats after auth passes
  useEffect(() => {
    if (authLoading) return;

    const fetchStats = async () => {
      try {
        const { data } = await API.get("/admin/dashboard");
        setStats(data.stats);
      } catch (err) {
        console.error("Admin error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        ⏳ Loading admin dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div>
    <AdminNavbar/>
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">👨‍💼 Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
          <p className="text-3xl font-bold mt-2 text-blue-600">
            {stats?.totalUsers ?? 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-700">Stock Items</h2>
          <p className="text-3xl font-bold mt-2 text-teal-600">
            {stats?.stockItems ?? 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-700">Low Stock</h2>
          <p className="text-3xl font-bold mt-2 text-red-600">
            {stats?.lowStock ?? 0}
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
