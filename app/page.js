"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { api } from "../lib/api";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await api.get("/products/");
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <main>
      <Navbar />

      <section className="bg-brand-dark text-white">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent-light">
            Fresh finds, made simple
          </p>
          <h1 className="max-w-xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Good things, <span className="italic text-accent-light">right on time.</span>
          </h1>
          <p className="mt-4 max-w-md text-white/70">
            Everyday products for the small moments that make your day feel better.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <h2 className="mb-6 font-display text-2xl font-semibold text-brand-dark">All products</h2>

        {loading && <p className="text-gray-500">Loading products...</p>}
        {error && (
          <p className="rounded bg-red-50 p-3 text-sm text-red-700">
            Could not load products: {error}
          </p>
        )}
        {!loading && !error && products.length === 0 && (
          <p className="text-gray-500">No products are available yet.</p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
