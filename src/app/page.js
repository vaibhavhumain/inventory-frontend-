"use client";
import Link from "next/link";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Welcome to <span className="text-blue-600">Inventory Manager</span>
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          A smarter way to manage your stock, streamline operations, and keep everything organized.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg transition"
          >
            Go to Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
          >
            Create Account
          </Link>
        </div>
      </div>

      <footer className="mt-16 text-sm text-gray-500">
        © {new Date().getFullYear()} Inventory Manager. All rights reserved.
      </footer>
    </div>
  );
}
