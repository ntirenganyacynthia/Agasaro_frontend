"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import Modal from "../../../components/Modal";

const EMPTY_FORM = { supplier_name: "", email: "", phone_number: "", address: "" };

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  async function loadSuppliers() {
    setLoading(true);
    try {
      const data = await api.get("/suppliers/", true);
      setSuppliers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSuppliers();
  }, []);

  function openAddForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  }

  function openEditForm(supplier) {
    setEditingId(supplier.supplier_id);
    setForm({
      supplier_name: supplier.supplier_name,
      email: supplier.email || "",
      phone_number: supplier.phone_number || "",
      address: supplier.address || "",
    });
    setFormError("");
    setShowModal(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    try {
      if (editingId) {
        await api.put(`/suppliers/${editingId}`, form, true);
      } else {
        await api.post("/suppliers/", form, true);
      }
      setShowModal(false);
      await loadSuppliers();
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleDelete(supplier) {
    if (!confirm(`Delete supplier "${supplier.supplier_name}"?`)) return;
    try {
      await api.del(`/suppliers/${supplier.supplier_id}`, true);
      await loadSuppliers();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-display font-semibold text-brand-dark">Suppliers</h1>
        <button
          onClick={openAddForm}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          + Add Supplier
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <table className="w-full overflow-hidden rounded-xl border border-brand-light bg-white text-sm">
          <thead className="bg-brand-light text-left text-brand-dark">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.supplier_id} className="border-t border-gray-100">
                <td className="px-4 py-2 font-medium text-gray-900">{supplier.supplier_name}</td>
                <td className="px-4 py-2 text-gray-600">{supplier.email || "-"}</td>
                <td className="px-4 py-2 text-gray-600">{supplier.phone_number || "-"}</td>
                <td className="px-4 py-2 text-gray-600">{supplier.address || "-"}</td>
                <td className="space-x-3 px-4 py-2 text-right">
                  <button onClick={() => openEditForm(supplier)} className="text-brand hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(supplier)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  No suppliers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {showModal && (
        <Modal title={editingId ? "Edit Supplier" : "Add Supplier"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                value={form.supplier_name}
                onChange={(e) => setForm({ ...form, supplier_name: e.target.value })}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone number</label>
              <input
                type="text"
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <button
              type="submit"
              className="w-full rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark"
            >
              Save
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
