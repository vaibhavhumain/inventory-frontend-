    "use client";
    import { useState } from "react";
    import API from "../utils/api";

    export default function NewItemModal({ onClose, onSave }) {
    const [form, setForm] = useState({
        category: "",
        headDescription: "",
        subDescription: "",
    });

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
    try {
        const payload = {
        category: form.category,
        headDescription: form.headDescription,
        subDescription: form.subDescription,
        };

        const res = await API.post("/items", payload);
        alert("Item added successfully!");

        onSave(res.data);
        onClose();
    } catch (err) {
        console.error("Error adding item:", err.response?.data || err.message);
        alert(`Failed: ${err.response?.data?.error || err.message}`);
    }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-[450px]">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Add New Item</h2>

            <div className="space-y-4">
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

            <div>
                <label className="block font-semibold">Head Description</label>
                <input
                type="text"
                name="headDescription"
                value={form.headDescription}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
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
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                Save
                </button>
            </div>
            </div>
        </div>
        </div>
    );
    }
