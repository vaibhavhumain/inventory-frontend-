"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { clearAuth, getUser } from "../utils/auth";  
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const logout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src="/logo.png"     
                alt="Stock Ledger Logo"
                width={32}
                height={32}
                className="rounded"
              />
              <span className="font-bold text-blue-700 text-lg">InveTrack</span>
            </Link>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
            <Link href="/feed" className="text-gray-700 hover:text-blue-600 font-medium">Feed Stock</Link>
            <Link href="/issue" className="text-gray-700 hover:text-blue-600 font-medium">Issue Stock</Link>
            <Link href="/reports" className="text-gray-700 hover:text-blue-600 font-medium">Reports</Link>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <span className="hidden sm:block text-sm text-gray-600">
                👤 {user.name} ({user.role})
              </span>
            )}
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
