"use client";
import React, { useState } from "react";
import API from "../utils/api";

export default function ItemModal({ item, onClose, onSave, historyData }) {
  const [formData, setFormData] = useState({
    ...item,
    mainStoreQty: item.mainStoreQty ?? 0,
    subStoreQty: item.subStoreQty ?? 0,
    closingQty:
      item.closingQty ?? (item.mainStoreQty ?? 0) + (item.subStoreQty ?? 0),
    addQty: "",
    targetStore: "",
    supplierName: item.supplierName || "",
    supplierAmount: "", // ✅ new
  });

  const remarksOptions = ["Dead Stock", "Fast Moving", "Slow Moving"];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddStock = () => {
    const qtyToAdd = Number(formData.addQty) || 0;
    if (!formData.targetStore || qtyToAdd <= 0) return;

    let newMain = formData.mainStoreQty;
    let newSub = formData.subStoreQty;
    let newTotal = formData.closingQty;

    if (formData.targetStore === "Main Store") {
      newMain += qtyToAdd;
      newTotal += qtyToAdd;
    } else if (formData.targetStore === "Sub Store") {
      newSub += qtyToAdd;
      newTotal += qtyToAdd;
    }

    setFormData((prev) => ({
      ...prev,
      mainStoreQty: newMain,
      subStoreQty: newSub,
      closingQty: newTotal,
      addQty: "",
      targetStore: "",
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        description: formData.description,
        category: formData.category,
        plantName: formData.plantName,
        weight: Number(formData.weight) || 0,
        unit: formData.unit,
        mainStoreQty: Number(formData.mainStoreQty) || 0,
        subStoreQty: Number(formData.subStoreQty) || 0,
        closingQty: Number(formData.closingQty) || 0,
        remarks: formData.remarks,
        supplierName: formData.supplierName || "",
        supplierAmount: Number(formData.supplierAmount) || 0, // ✅ send to backend
      };

      delete payload._id;
      delete payload.__v;

      await API.put(`/items/${formData.code}`, payload);

      onSave({ ...item, ...payload });
      onClose();
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Update failed");
    }
  };

  const stockHistory = historyData?.stock || [];
  const supplierHistory = historyData?.supplierHistory || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[800px] max-h-[90vh] overflow-y-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b pb-3">
          <h2 className="text-2xl font-bold text-blue-700">
            Item Profile – {item.code}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            ✖
          </button>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left side – static info */}
          <div className="space-y-3 bg-blue-50 p-4 rounded-xl shadow-inner">
            <p><span className="font-semibold">Category:</span> {formData.category || "-"}</p>
            <p><span className="font-semibold">Plant:</span> {formData.plantName || "-"}</p>
            <p><span className="font-semibold">Weight:</span> {formData.weight || "-"} {formData.unit}</p>
            <p><span className="font-semibold">Total Qty:</span> {formData.closingQty || 0}</p>
            <p><span className="font-semibold">Main Store Qty:</span> {formData.mainStoreQty || 0}</p>
            <p><span className="font-semibold">Sub Store Qty:</span> {formData.subStoreQty || 0}</p>
            <p><span className="font-semibold">Remarks:</span> {formData.remarks || "-"}</p>
          </div>

          {/* Right side – editable form */}
          <div className="space-y-4">
            {/* Description */}
            <label className="block text-sm font-medium">Description</label>
            <textarea
              rows="3"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            />

            {/* Add stock */}
            <label className="block text-sm font-medium">Add Quantity to Store</label>
            <div className="flex gap-2">
              <select
                value={formData.targetStore || ""}
                onChange={(e) => handleChange("targetStore", e.target.value)}
                className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              >
                <option value="">-- Select Store --</option>
                <option value="Main Store">Main Store</option>
                <option value="Sub Store">Sub Store</option>
              </select>
              <input
                type="number"
                placeholder="Qty"
                value={formData.addQty || ""}
                onChange={(e) => handleChange("addQty", e.target.value)}
                className="w-24 border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={handleAddStock}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add
              </button>
            </div>

            {/* Supplier */}
            <label className="block text-sm font-medium">Supplier Name</label>
            <input
              type="text"
              placeholder="Enter Supplier Name"
              value={formData.supplierName || ""}
              onChange={(e) => handleChange("supplierName", e.target.value)}
              className="w-full border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            />

            <label className="block text-sm font-medium">Supplier Amount</label>
            <input
              type="number"
              placeholder="Enter Amount"
              value={formData.supplierAmount || ""}
              onChange={(e) => handleChange("supplierAmount", e.target.value)}
              className="w-full border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            />

            {/* Remarks */}
            <label className="block text-sm font-medium">Remarks</label>
            <select
              value={formData.remarks || ""}
              onChange={(e) => handleChange("remarks", e.target.value)}
              className="w-full border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Select Remark --</option>
              {remarksOptions.map((rem) => (
                <option key={rem} value={rem}>{rem}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stock History */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 Stock History</h3>
          <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
            <table className="w-full text-xs">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-2 py-2 text-left">Date</th>
                  <th className="px-2 py-2 text-left">In</th>
                  <th className="px-2 py-2 text-left">Out</th>
                  <th className="px-2 py-2 text-left">Closing Qty</th>
                </tr>
              </thead>
              <tbody>
                {stockHistory.length > 0 ? (
                  stockHistory.map((h, i) => (
                    <tr key={i}>
                      <td className="px-2 py-2 text-gray-700">{new Date(h.date).toLocaleDateString()}</td>
                      <td className="px-2 py-2 text-green-600 font-medium">{h.in}</td>
                      <td className="px-2 py-2 text-red-600 font-medium">{h.out}</td>
                      <td className="px-2 py-2 text-gray-800 font-semibold">{h.closingQty}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-2 py-3 text-center text-gray-400">
                      No stock history yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Supplier History */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">🏭 Supplier History</h3>
          <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
            <table className="w-full text-xs">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-2 py-2 text-left">Date</th>
                  <th className="px-2 py-2 text-left">Supplier</th>
                  <th className="px-2 py-2 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {supplierHistory.length > 0 ? (
                  supplierHistory.map((s, i) => (
                    <tr key={i}>
                      <td className="px-2 py-2 text-gray-700">{new Date(s.date).toLocaleDateString()}</td>
                      <td className="px-2 py-2 text-gray-700">{s.supplierName}</td>
                      <td className="px-2 py-2 text-gray-800 font-semibold">{s.amount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-2 py-3 text-center text-gray-400">
                      No supplier history yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg shadow"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
