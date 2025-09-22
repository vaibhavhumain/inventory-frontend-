"use client";
import { useState } from "react";
import API from "../utils/api";

export default function VendorModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name) {
      alert("Vendor Name is required");
      return;
    }

    const payload = { name, address, state, gstNumber };

    try {
      setLoading(true);
      const res = await API.post("/vendors", payload);
      onSave(res.data); // new vendor with auto-generated code
      onClose();
    } catch (err) {
      console.error("Error adding vendor:", err.response?.data || err.message);
      alert(`Error: ${err.response?.data?.error || "Failed to add vendor"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add New Vendor</h2>

        <div className="space-y-3">
          {/* Vendor Code is auto-generated, no input here */}

          <div>
            <label className="block font-semibold">Vendor Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border p-2 rounded"
              placeholder="Enter vendor name"
            />
          </div>

          <div>
            <label className="block font-semibold">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full border p-2 rounded"
              placeholder="Enter address"
            />
          </div>

          <div>
            <label className="block font-semibold">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              className="w-full border p-2 rounded"
              placeholder="Enter state"
            />
          </div>

          <div>
            <label className="block font-semibold">GST Number</label>
            <input
              type="text"
              value={gstNumber}
              required
              onChange={(e) => setGstNumber(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Enter GST number"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${
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
