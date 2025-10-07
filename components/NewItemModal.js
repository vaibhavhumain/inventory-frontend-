"use client";
import { useState } from "react";
import API from "../utils/api";
import { toast } from "sonner"; // ✅ Sonner import

export default function NewItemModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    category: "",
    headDescription: "",
    subDescription: "",
    hsnCode: "",
    gstRate: "",
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    "raw material",
    "consumables",
    "bought out",
    "hardware",
    "electronics",
    "electricals",
    "paints",
    "rubbers",
    "chemicals",
    "adhesive",
    "plastics",
    "furniture",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      onSave(res.data);
      onClose();
    } catch (err) {
      console.error("Error adding item:", err.response?.data || err.message);

      const errorMsg =
        err.response?.data?.error || "Failed to add item. Please try again.";

      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[450px]">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Add New Item</h2>

        <div className="space-y-4">
          {/* Category */}
          <div>
            <label className="block font-semibold">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Head Description */}
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

          {/* Sub Description */}
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

          {/* HSN Code */}
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

          {/* GST Rate */}
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

          {/* Buttons */}
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
