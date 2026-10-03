"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import Modal from "../../../components/Modal";

const EMPTY_FORM = { category_name: "", category_description: "" };

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  async function loadCategories() {
    setLoading(true);
    try {
      const data = await api.get("/categories/");
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function openAddForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  }

  function openEditForm(category) {
    setEditingId(category.category_id);
    setForm({
      category_name: category.category_name,
      category_description: category.category_description || "",
    });
    setFormError("");
    setShowModal(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form, true);
      } else {
        await api.post("/categories/", form, true);
      }
      setShowModal(false);
      await loadCategories();
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleDelete(category) {
    if (!confirm(`Delete category "${category.category_name}"?`)) return;
    try {
      await api.del(`/categories/${category.category_id}`, true);
      await loadCategories();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-display font-semibold text-brand-dark">Categories</h1>
        <button
          onClick={openAddForm}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          + Add Category
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <table className="w-full overflow-hidden rounded-xl border border-brand-light bg-white text-sm">
          <thead className="bg-brand-light text-left text-brand-dark">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.category_id} className="border-t border-gray-100">
                <td className="px-4 py-2 font-medium text-gray-900">{category.category_name}</td>
                <td className="px-4 py-2 text-gray-600">{category.category_description || "-"}</td>
                <td className="space-x-3 px-4 py-2 text-right">
                  <button onClick={() => openEditForm(category)} className="text-brand hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(category)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {showModal && (
        <Modal title={editingId ? "Edit Category" : "Add Category"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                value={form.category_name}
                onChange={(e) => setForm({ ...form, category_name: e.target.value })}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={form.category_description}
                onChange={(e) => setForm({ ...form, category_description: e.target.value })}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                rows={3}
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
