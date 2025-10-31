"use client";
import Link from "next/link";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-100 flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <div className="text-xl font-bold text-blue-700">Inventory Manager</div>
        <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
        </nav>
        <Link
          href="/register"
          className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col-reverse md:flex-row items-center justify-between flex-1 px-8 md:px-16 lg:px-32">
        {/* Left content */}
        <div className="max-w-lg text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Smarter{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Inventory Management
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Keep track of your stock, suppliers, and departments in one
            powerful, easy-to-use platform. Stay in control, save time, and
            reduce errors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              href="/login"
              className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
            >
              Go to Login
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 font-medium hover:shadow-md transition"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Right illustration */}
        <div className="mb-10 md:mb-0 flex justify-center">
          <div className="bg-white rounded-xl shadow-xl p-4 transform transition duration-500 hover:scale-105 hover:shadow-2xl">
            <img
              src="/inventory-illustration.jpg"
              alt="Inventory Illustration"
              className="w-full max-w-md rounded-lg"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-600 bg-white shadow-inner">
        © {new Date().getFullYear()} Gobind Coach Builders. All rights reserved.
      </footer>
    </div>
  );
}
