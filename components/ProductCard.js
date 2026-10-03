"use client";

import { useState } from "react";
import { useCart } from "../lib/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const outOfStock = Number(product.available_quantity) <= 0;

  function handleAddToCart() {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-col justify-between rounded-xl border border-brand-light bg-white p-4 shadow-sm">
      <div>
        <h3 className="font-semibold text-brand-dark">{product.product_name}</h3>
        <p className="mt-1 text-lg font-semibold text-accent-dark">
          RWF {Number(product.unit_price).toLocaleString()}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {outOfStock
            ? "Out of stock"
            : `${Number(product.available_quantity)} available`}
        </p>
      </div>

      {!outOfStock && (
        <div className="mt-4 flex items-center gap-2">
          <input
            type="number"
            min="1"
            max={Number(product.available_quantity)}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-sm"
          />
          <button
            onClick={handleAddToCart}
            className="flex-1 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-dark"
          >
            {added ? "Added!" : "Add to cart"}
          </button>
        </div>
      )}
    </div>
  );
}
