"use client";
import { useState } from "react";
import API from "../utils/api";

export default function VendorModal({ onClose, onSave }) {
  const [code, setCode] = useState("");   
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [gstNumber, setGstNumber] = useState("");

  const handleSave = async () => {
    if (!code || !name) {
      alert("Vendor Code and Name are required");
      return;
    }

    const payload = { code, name, address, state, gstNumber };

    try {
      const res = await API.post("/vendors", payload);
      onSave(res.data);
      onClose();
    } catch (err) {
      console.error("Error adding vendor:", err.response?.data || err.message);
      alert(`Error: ${err.response?.data?.error || "Failed to add vendor"}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add New Vendor</h2>

        <div className="space-y-3">
          <div>
            <label className="block font-semibold">Vendor Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full border p-2 rounded"
              placeholder="Enter unique vendor code"
            />
          </div>

          <div>
            <label className="block font-semibold">Vendor Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">GST Number</label>
            <input
              type="text"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              className="w-full border p-2 rounded"
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
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
