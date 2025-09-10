"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clearAuth } from "../utils/auth";

export default function AdminNavbar() {
  const pathname = usePathname();
  const logout = () => {
    clearAuth();
    window.location.href = "/login";
  };

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/items", label: "Items" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/reports", label: "Reports" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* ✅ Center links */}
        <div className="flex-1 flex justify-center gap-6 items-center">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-medium transition ${
                pathname === link.href
                  ? "text-teal-600 border-b-2 border-teal-600 pb-1"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* ✅ Logout aligned right */}
        <button
          onClick={logout}
          title="Logout"
          className="ml-6 px-3 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 text-sm shadow-sm transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
