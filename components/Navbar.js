"use client";

import Link from "next/link";
import { useCart } from "../lib/CartContext";
import Logo from "./Logo";

export default function Navbar() {
  const { items } = useCart();

  let itemCount = 0;
  for (const item of items) {
    itemCount += Number(item.quantity);
  }

  return (
    <header className="bg-brand-dark text-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/">
          <Logo tagline="Everyday, elevated" />
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-accent-light">
            Products
          </Link>
          <Link href="/cart" className="flex items-center gap-1.5 hover:text-accent-light">
            Cart
            {itemCount > 0 && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <Link
            href="/admin/login"
            className="rounded-full border border-white/30 px-3 py-1 text-xs font-medium hover:border-accent hover:text-accent-light"
          >
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
