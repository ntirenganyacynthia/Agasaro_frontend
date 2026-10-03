"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import { useCart } from "../../lib/CartContext";
import { api } from "../../lib/api";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();

  const [customerName, setCustomerName] = useState("Walk-in customer");
  const [paymentMethod, setPaymentMethod] = useState("mobile_money");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function generateIdempotencyKey() {
    return `web-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  async function handleCheckout(event) {
    event.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (paymentMethod === "mobile_money" && !phoneNumber) {
      setError("Please enter a phone number for mobile money payment.");
      return;
    }

    setSubmitting(true);
    try {
      const order = {
        customer_name: customerName || "Walk-in customer",
        payment_method: paymentMethod,
        phone_number: paymentMethod === "mobile_money" ? phoneNumber : null,
        idempotency_key: generateIdempotencyKey(),
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };

      const response = await api.post("/checkout/", order);
      setResult(response);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <main>
        <Navbar />
        <div className="mx-auto max-w-md px-4 py-10 text-center">
          <h1 className="mb-2 text-2xl font-bold text-brand">Order placed!</h1>
          <p className="text-gray-600">{result.message}</p>
          <div className="mt-6 space-y-1 rounded-lg border border-gray-200 bg-white p-4 text-left text-sm">
            <p><strong>Sale ID:</strong> {result.sale_id}</p>
            <p><strong>Total:</strong> RWF {Number(result.total_amount).toLocaleString()}</p>
            <p><strong>Payment status:</strong> {result.payment_status}</p>
            <p><strong>Sale status:</strong> {result.sale_status}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-display font-semibold text-brand-dark">Your Cart</h1>

        {items.length === 0 ? (
          <p className="text-gray-500">Your cart is empty. Go add some products!</p>
        ) : (
          <>
            <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
              {items.map((item) => (
                <div key={item.product_id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-gray-900">{item.product_name}</p>
                    <p className="text-sm text-gray-500">
                      RWF {Number(item.unit_price).toLocaleString()} each
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      max={item.available_quantity}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.product_id, Number(e.target.value))}
                      className="w-16 rounded border border-gray-300 px-2 py-1 text-sm"
                    />
                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-right text-lg font-bold text-gray-900">
              Total: RWF {total.toLocaleString()}
            </p>

            <form onSubmit={handleCheckout} className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-white p-4">
              <h2 className="font-semibold text-gray-900">Checkout</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700">Your name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Payment method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="mobile_money">Mobile Money</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                </select>
              </div>

              {paymentMethod === "mobile_money" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="078xxxxxxx"
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              )}

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-50"
              >
                {submitting ? "Placing order..." : "Place order"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
