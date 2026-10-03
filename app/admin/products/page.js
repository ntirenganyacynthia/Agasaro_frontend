"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import Modal from "../../../components/Modal";

const EMPTY_FORM = {
  category_id: "",
  supplier_id: "",
  product_name: "",
  unit_price: "",
  cost_price: "",
  stock_quantity: "",
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  async function loadEverything() {
    setLoading(true);
    try {
      const [productList, categoryList, supplierList] = await Promise.all([
        api.get("/products/"),
        api.get("/categories/"),
        api.get("/suppliers/", true),
      ]);
      setProducts(productList);
      setCategories(categoryList);
      setSuppliers(supplierList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEverything();
  }, []);

  function categoryName(id) {
    const match = categories.find((category) => category.category_id === id);
    return match ? match.category_name : "-";
  }

  function supplierName(id) {
    const match = suppliers.find((supplier) => supplier.supplier_id === id);
    return match ? match.supplier_name : "-";
  }

  function openAddForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  }

  function openEditForm(product) {
    setEditingId(product.product_id);
    setForm({
      category_id: product.category_id,
      supplier_id: product.supplier_id,
      product_name: product.product_name,
      unit_price: product.unit_price,
      cost_price: product.cost_price ?? "",
      stock_quantity: product.stock_quantity,
    });
    setFormError("");
    setShowModal(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const payload = {
      category_id: Number(form.category_id),
      supplier_id: Number(form.supplier_id),
      product_name: form.product_name,
      unit_price: Number(form.unit_price),
      cost_price: Number(form.cost_price),
      stock_quantity: Number(form.stock_quantity),
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload, true);
      } else {
        await api.post("/products/", payload, true);
      }
      setShowModal(false);
      await loadEverything();
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleDelete(product) {
    if (!confirm(`Delete product "${product.product_name}"?`)) return;
    try {
      await api.del(`/products/${product.product_id}`, true);
      await loadEverything();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-display font-semibold text-brand-dark">Products</h1>
        <button
          onClick={openAddForm}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          + Add Product
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <table className="w-full overflow-hidden rounded-xl border border-brand-light bg-white text-sm">
          <thead className="bg-brand-light text-left text-brand-dark">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Supplier</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Available</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.product_id} className="border-t border-gray-100">
                <td className="px-4 py-2 font-medium text-gray-900">{product.product_name}</td>
                <td className="px-4 py-2 text-gray-600">{categoryName(product.category_id)}</td>
                <td className="px-4 py-2 text-gray-600">{supplierName(product.supplier_id)}</td>
                <td className="px-4 py-2 text-gray-600">
                  RWF {Number(product.unit_price).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-gray-600">{Number(product.stock_quantity)}</td>
                <td className="px-4 py-2 text-gray-600">{Number(product.available_quantity)}</td>
                <td className="space-x-3 px-4 py-2 text-right">
                  <button onClick={() => openEditForm(product)} className="text-brand hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {showModal && (
        <Modal title={editingId ? "Edit Product" : "Add Product"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product name</label>
              <input
                type="text"
                required
                value={form.product_name}
                onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                required
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Supplier</label>
              <select
                required
                value={form.supplier_id}
                onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Select a supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.supplier_id} value={supplier.supplier_id}>
                    {supplier.supplier_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Selling price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={form.unit_price}
                  onChange={(e) => setForm({ ...form, unit_price: e.target.value })}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cost price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={form.cost_price}
                  onChange={(e) => setForm({ ...form, cost_price: e.target.value })}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Stock quantity</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={form.stock_quantity}
                onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
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
