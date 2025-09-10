"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../../utils/api";
import { getToken, clearAuth } from "../../../utils/auth";
import AdminNavbar from "../../../components/AdminNavbar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";

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

  // Dummy data for charts (replace with backend stats if available)
  const revenueData = [
    { year: "2019", value: 200 },
    { year: "2020", value: 400 },
    { year: "2021", value: 350 },
    { year: "2022", value: 600 },
    { year: "2023", value: 800 },
  ];

  const emailData = [
    { name: "Marketplace", value: 3654 },
    { name: "Last Week", value: 954 },
    { name: "Last Month", value: 8462 },
  ];

  return (
    <div>
      <AdminNavbar />
      <div className="min-h-screen p-6 bg-gray-50">

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-gray-600 text-sm">Total Users</h2>
            <p className="text-3xl font-bold text-blue-600">
              {stats?.totalUsers ?? 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">↑ Growth from last month</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-gray-600 text-sm">Stock Items</h2>
            <p className="text-3xl font-bold text-teal-600">
              {stats?.stockItems ?? 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">↑ Updated regularly</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-gray-600 text-sm">Low Stock</h2>
            <p className="text-3xl font-bold text-red-600">
              {stats?.lowStock ?? 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">↓ Needs restocking</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-gray-600 text-sm">Reports Generated</h2>
            <p className="text-3xl font-bold text-purple-600">
              {stats?.reports ?? 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">↑ Last 30 days</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Revenue Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">📈 Revenue Growth</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Email Sent Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">📨 Email Sent</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={emailData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {emailData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#3b82f6", "#10b981", "#f59e0b"][index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Visitors Trend */}
        <div className="bg-white mt-8 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">👥 Unique Visitors</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#0ea5e9" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
