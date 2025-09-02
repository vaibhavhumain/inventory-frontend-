"use client";
import Link from "next/link";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="text-center max-w-2xl">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Inventory Manager
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-gray-700 text-lg md:text-xl">
          A smarter way to manage your stock, streamline operations, and keep everything organized.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md 
            transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            Go to Login
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 font-medium 
            transform transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95"
          >
            Create Account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-sm text-gray-600">
        © {new Date().getFullYear()} Vaibhav. All rights reserved.
      </footer>
    </div>
  );
}
