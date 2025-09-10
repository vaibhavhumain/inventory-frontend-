"use client";
import AdminNavbar from "../../../../components/AdminNavbar";
export default function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <AdminNavbar />
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          👥 Manage Users
        </h1>
        <p className="text-gray-600">This is the placeholder for user management.</p>
      </div>
    </div>
  );
}
