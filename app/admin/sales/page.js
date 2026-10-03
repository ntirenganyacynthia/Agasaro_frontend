"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSales() {
      try {
        const data = await api.get("/sales/", true);
        setSales(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadSales();
  }, []);

  function formatDate(isoString) {
    return new Date(isoString).toLocaleString();
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-display font-semibold text-brand-dark">Sales</h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <table className="w-full overflow-hidden rounded-xl border border-brand-light bg-white text-sm">
          <thead className="bg-brand-light text-left text-brand-dark">
            <tr>
              <th className="px-4 py-2">Sale ID</th>
              <th className="px-4 py-2">Customer ID</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.sale_id} className="border-t border-gray-100">
                <td className="px-4 py-2 font-medium text-gray-900">#{sale.sale_id}</td>
                <td className="px-4 py-2 text-gray-600">{sale.customer_id}</td>
                <td className="px-4 py-2 text-gray-600">
                  RWF {Number(sale.total_amount).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  <span className="rounded-full bg-accent-light px-2 py-0.5 text-xs font-medium text-accent-dark">
                    {sale.sale_status}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-500">{formatDate(sale.sale_date)}</td>
              </tr>
            ))}
            {sales.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  No sales yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
