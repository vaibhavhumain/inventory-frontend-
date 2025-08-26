'use client';
import Link from "next/link";
import RequireAuth from "../../../components/RequireAuth";
import ExportForm from "../../../components/ExportForm";
import { clearAuth, getUser } from "../../../utils/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => setUser(getUser()), []);

  const logout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <RequireAuth>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/feed"
              className="block bg-white rounded-xl shadow p-6 hover:shadow-md border border-gray-100"
            >
              <div className="text-2xl">➕</div>
              <h3 className="mt-2 font-semibold text-gray-800">Feed Stock</h3>
              <p className="text-sm text-gray-500">Add incoming materials.</p>
            </Link>

            <Link
              href="/issue"
              className="block bg-white rounded-xl shadow p-6 hover:shadow-md border border-gray-100"
            >
              <div className="text-2xl">➖</div>
              <h3 className="mt-2 font-semibold text-gray-800">Issue Stock</h3>
              <p className="text-sm text-gray-500">Record issued items.</p>
            </Link>

            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
              <div className="text-2xl">⬇️</div>
              <h3 className="mt-2 font-semibold text-gray-800">Export Report</h3>
              <p className="text-sm text-gray-500 mb-3">
                Download Excel by date or range.
              </p>
              <ExportForm />
            </div>
          </div>
        </div>
    </RequireAuth>
  );
}
