"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavbar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/items", label: "Items" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/reports", label: "Reports" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <h1 className="font-bold text-xl text-blue-600">Admin Panel</h1>
          <div className="flex gap-6">
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
        </div>
      </div>
    </nav>
  );
}
