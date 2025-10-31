"use client";
import { useEffect, useState } from "react";
import API from "../utils/api";
import { toast } from "sonner";

export default function NewItemModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    category: "",
    headDescription: "",
    subDescription: "",
    hsnCode: "",
    gstRate: "",
  });

  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCat, setNewCat] = useState({ label: "", prefix: "" });
  const [savingCat, setSavingCat] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/categories");
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast.error("Failed to load categories");
      }
    })();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveCategory = async () => {
    const label = newCat.label.trim();
    const prefix = newCat.prefix.trim().toUpperCase();

    if (!label || !prefix) {
      toast.error("Please fill both label and prefix");
      return;
    }
    if (!/^[A-Z]{2,4}$/.test(prefix)) {
      toast.error("Prefix must be 2–4 uppercase letters (e.g., RM, HW, FG)");
      return;
    }

    try {
      setSavingCat(true);
      const { data } = await API.post("/categories", { label, prefix });
      setCategories((prev) => [...prev, data].sort((a, b) => a.label.localeCompare(b.label)));
      setForm((prev) => ({ ...prev, category: data._id }));
      setShowAddCat(false);
      setNewCat({ label: "", prefix: "" });
      toast.success(`Category "${data.label}" added successfully`);
    } catch (err) {
      console.error("Error saving category:", err);
      toast.error(err.response?.data?.error || "Failed to add category");
    } finally {
      setSavingCat(false);
    }
  };

  const handleSave = async () => {
    if (!form.category || !form.headDescription) {
      toast.error("Please fill all required fields");
      return;
    }
    if (form.gstRate && isNaN(form.gstRate)) {
      toast.error("GST Rate must be a number");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        category: form.category,
        headDescription: form.headDescription,
        subDescription: form.subDescription,
        hsnCode: form.hsnCode,
        gstRate: Number(form.gstRate) || 0,
      };

      const res = await API.post("/items", payload);
      toast.success(`Item "${res.data.headDescription}" added successfully!`);
      onSave?.(res.data);
      onClose?.();
    } catch (err) {
      console.error("Error adding item:", err);
      toast.error(err.response?.data?.error || "Failed to add item");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[500px]">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Add New Item</h2>

        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Category</label>
            <div className="flex gap-2">
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.label} ({cat.prefix})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowAddCat((v) => !v)}
                className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                + New
              </button>
            </div>

            {showAddCat && (
              <div className="mt-3 grid grid-cols-3 gap-2 border p-3 rounded bg-gray-50">
                <input
                  type="text"
                  placeholder="Label (e.g. Fiberglass)"
                  value={newCat.label}
                  onChange={(e) => setNewCat((p) => ({ ...p, label: e.target.value }))}
                  className="col-span-2 border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Prefix (e.g. FG)"
                  value={newCat.prefix}
                  onChange={(e) => setNewCat((p) => ({ ...p, prefix: e.target.value }))}
                  className="border p-2 rounded"
                  maxLength={4}
                />
                <div className="col-span-3 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowAddCat(false);
                      setNewCat({ label: "", prefix: "" });
                    }}
                    className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveCategory}
                    disabled={savingCat}
                    className={`px-3 py-2 rounded text-white ${
                      savingCat
                        ? "bg-green-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {savingCat ? "Saving..." : "Save Category"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold">Head Description</label>
            <input
              type="text"
              name="headDescription"
              value={form.headDescription}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              placeholder="Enter item name or head description"
            />
          </div>

          <div>
            <label className="block font-semibold">Sub Description</label>
            <input
              type="text"
              name="subDescription"
              value={form.subDescription}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter detailed description (optional)"
            />
          </div>

          <div>
            <label className="block font-semibold">HSN Code</label>
            <input
              type="text"
              name="hsnCode"
              value={form.hsnCode}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter HSN code"
            />
          </div>

          <div>
            <label className="block font-semibold">GST Rate (%)</label>
            <input
              type="number"
              name="gstRate"
              value={form.gstRate}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="e.g. 5, 12, 18, 28"
              min="0"
              max="100"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className={`px-4 py-2 text-white rounded ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
