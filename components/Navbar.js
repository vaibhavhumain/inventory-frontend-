"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { clearAuth, getUser } from "../utils/auth";
import { useEffect, useState } from "react";
import { Menu, X, LogOut } from "lucide-react"; // ✅ nice icons

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const logout = () => {
    clearAuth();
    router.push("/login");
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/feed", label: "Feed Stock" },
    { href: "/issue", label: "Issue Stock" },
    { href: "/items", label: "Items" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo + Brand */}
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Stock Ledger Logo"
                width={36}
                height={36}
                className="rounded"
              />
              <span className="font-bold text-blue-700 text-xl tracking-wide">
                InveTrack
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-gray-700 hover:text-blue-600 font-medium transition"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* User Info + Logout */}
          <div className="flex items-center gap-4">
            {user && (
              <span className="hidden sm:block text-sm text-gray-600">
                👤 {user.name}{" "}
                <code className="text-gray-400">({user.role}@GC)</code>
              </span>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm transition"
            >
              <LogOut size={16} />
              Logout
            </button>

            {/* Mobile menu button */}
            <button
              className="sm:hidden text-gray-600 hover:text-blue-600"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="sm:hidden bg-white border-t shadow-md">
          <div className="px-4 py-3 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-gray-700 hover:text-blue-600 font-medium"
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <div className="pt-2 border-t text-sm text-gray-600">
                👤 {user.name} <code>({user.role}@GC)</code>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
