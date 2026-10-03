"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReceipts() {
      try {
        const data = await api.get("/receipts/", true);
        setReceipts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadReceipts();
  }, []);

  function formatDate(isoString) {
    return new Date(isoString).toLocaleString();
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-display font-semibold text-brand-dark">Receipts</h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <table className="w-full overflow-hidden rounded-xl border border-brand-light bg-white text-sm">
          <thead className="bg-brand-light text-left text-brand-dark">
            <tr>
              <th className="px-4 py-2">Receipt #</th>
              <th className="px-4 py-2">Sale ID</th>
              <th className="px-4 py-2">Issued at</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt) => (
              <tr key={receipt.receipt_id} className="border-t border-gray-100">
                <td className="px-4 py-2 font-medium text-gray-900">{receipt.receipt_number}</td>
                <td className="px-4 py-2 text-gray-600">#{receipt.sale_id}</td>
                <td className="px-4 py-2 text-gray-500">{formatDate(receipt.issued_at)}</td>
              </tr>
            ))}
            {receipts.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                  No receipts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
