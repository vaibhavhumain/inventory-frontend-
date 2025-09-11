"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { clearAuth, getUser } from "../utils/auth";
import { useEffect, useState } from "react";
import { Menu, X, LogOut } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
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
    // { href: "/analytics", label: "Analytics" },
  ];
  return (
    <nav className="bg-white shadow-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo + Brand */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="InveTrack Logo"
              width={36}
              height={36}
              className="rounded"
            />
            <span className="font-bold text-blue-700 text-xl tracking-wide">
              InveTrack
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-medium transition ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                  {/* underline animation */}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              );
            })}
          </div>

          {/* User Info + Logout */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-semibold text-gray-700">
                  {user.name}
                </span>
                <span className="text-xs text-gray-500">
                  {user.role}@GC
                </span>
              </div>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 text-sm shadow-sm transition"
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
        <div className="sm:hidden bg-white border-t shadow-md animate-slide-down">
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block font-medium ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {user && (
              <div className="pt-3 border-t text-sm text-gray-600">
                👤 {user.name} <code>({user.role}@GC)</code>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
