"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { clearAuth, getUser } from "../utils/auth";
import { useEffect, useState } from "react";
import { Menu, X, LogOut, ChevronDown } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [issueDropdownOpen, setIssueDropdownOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const logout = () => {
    clearAuth();
    router.push("/login");
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    {
      label: "Issue Stock",
      children: [
        { href: "/issue-main-sub", label: "Main → Sub" },
        { href: "/issue-sub-user", label: "Sub → User" },
      ],
    },
    { href: "/items", label: "Items" },
    { href: "/invoice", label: "Purchase Invoice" },
  ];

  return (
    <nav className="bg-white shadow-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Nav Center */}
          <div className="flex-1 flex justify-center">
            <div className="hidden sm:flex items-center gap-8">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label} className="relative">
                    <button
                      onClick={() => setIssueDropdownOpen(!issueDropdownOpen)}
                      className={`flex items-center gap-1 font-medium ${
                        pathname.startsWith("/issue")
                          ? "text-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      }`}
                    >
                      {link.label} <ChevronDown size={16} />
                    </button>

                    {issueDropdownOpen && (
                      <div className="absolute bg-white border rounded shadow-lg mt-2 w-40 z-50">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setIssueDropdownOpen(false)}
                            className={`block px-4 py-2 text-sm ${
                              pathname === child.href
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-medium ${
                      pathname === link.href
                        ? "text-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* User Info + Logout (Right aligned) */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-semibold text-gray-700">
                  {user.name}
                </span>
                <span className="text-xs text-gray-500">{user.role}@GC</span>
              </div>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 text-sm shadow-sm transition"
            >
              <LogOut size={16} />
              Logout
            </button>

            {/* Mobile toggle button */}
            <button
              className="sm:hidden text-gray-600 hover:text-blue-600"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-white border-t shadow-md animate-slide-down">
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <button
                    onClick={() => setIssueDropdownOpen(!issueDropdownOpen)}
                    className="w-full text-left font-medium flex items-center gap-1"
                  >
                    {link.label} <ChevronDown size={16} />
                  </button>
                  {issueDropdownOpen && (
                    <div className="pl-4 space-y-2 mt-2">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => {
                            setIssueDropdownOpen(false);
                            setMobileOpen(false);
                          }}
                          className={`block text-sm ${
                            pathname === child.href
                              ? "text-blue-600"
                              : "text-gray-700 hover:text-blue-600"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block font-medium ${
                    pathname === link.href
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}

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
