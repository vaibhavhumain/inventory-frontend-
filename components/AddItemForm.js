"use client";
import { useState } from "react";

export default function AddItemForm({ onClose, onSave }) {
  const [newItem, setNewItem] = useState({
    category: "",
    description: "",
    plantName: "",
    weight: "",
    unit: "",
    location: "",
    closingQty: 0
  });

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(newItem); 
    setNewItem({
      category: "",
      description: "",
      plantName: "",
      weight: "",
      unit: "",
      location: "",
      closingQty: ""
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-[500px] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold text-blue-700 mb-4">Add New Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["category", "description", "plantName", "weight", "unit", "location", "closingQty"].map((field) => (
            <input
              key={field}
              type={field === "weight" ? "number" : "text"}
              name={field}
              value={newItem[field]}
              onChange={handleChange}
              placeholder={field}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              required={["category", "description"].includes(field)}
            />
          ))}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
