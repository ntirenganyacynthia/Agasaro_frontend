"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../lib/AuthContext";
import Logo from "./Logo";

const LINKS = [
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/suppliers", label: "Suppliers" },
  { href: "/admin/sales", label: "Sales" },
  { href: "/admin/receipts", label: "Receipts" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="flex w-60 flex-shrink-0 flex-col justify-between bg-brand-dark p-5 text-white">
      <div>
        <div className="mb-8">
          <Logo tagline="Admin workspace" />
        </div>
        <nav className="space-y-1">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname.startsWith(link.href)
                  ? "bg-white/10 text-accent-light"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-white/10 pt-4 text-sm">
        <p className="text-white/50">
          Signed in as <span className="font-medium text-white">{user?.username}</span>
        </p>
        <p className="text-white/40">Role: {user?.role}</p>
        <button onClick={logout} className="mt-2 text-accent-light hover:underline">
          Log out
        </button>
      </div>
    </aside>
  );
}
