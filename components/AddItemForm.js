import { useState } from "react";

export default function AddItemForm({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    code: "",
    category: "",
    customCategoryMode: false,
    description: "",
    plantName: "",
    weight: "",
    unit: "",
    customUnitMode: false,
    closingQty: "",
    storeLocation: "",
    remarks: "",
    suppliers: [{ name: "", amount: "" }], // amount = rate per unit
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Supplier change
  const handleSupplierChange = (index, field, value) => {
    const updated = [...formData.suppliers];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, suppliers: updated }));
  };

  // Add/remove supplier
  const addSupplier = () =>
    setFormData((prev) => ({
      ...prev,
      suppliers: [...prev.suppliers, { name: "", amount: "" }],
    }));

  const removeSupplier = (index) =>
    setFormData((prev) => ({
      ...prev,
      suppliers: prev.suppliers.filter((_, i) => i !== index),
    }));

  const handleSubmit = (e) => {
    e.preventDefault();

    const enteredQty = formData.closingQty ? Number(formData.closingQty) : 0;

    onSave({
      ...formData,
      weight: formData.weight ? Number(formData.weight) : undefined,
      closingQty: enteredQty,
      unit: formData.unit?.trim(),
      category: formData.category?.trim(),
      suppliers: formData.suppliers.filter((s) => s.name || s.amount),
    });
  };

  // ✅ Units
  const unitOptions = [
    { value: "BAG", label: "Bag" },
    { value: "BDL", label: "Bundles" },
    { value: "BOX", label: "Boxes" },
    { value: "FEET", label: "Feets" },
    { value: "KG", label: "Kilogram" },
    { value: "LTR", label: "Litre" },
    { value: "MTR", label: "Meter" },
    { value: "NOS", label: "Numbers" },
    { value: "PAC", label: "Packet" },
    { value: "PCS", label: "Pieces" },
    { value: "ROLL", label: "Rolls" },
    { value: "SET", label: "Sets" },
    { value: "SQFT", label: "Square Feet" },
    { value: "SQM", label: "Square Meters" },
  ];

  // ✅ Default Categories
  const categoryOptions = [
    "Adhesive",
    "Bought Out",
    "Chemicals",
    "Consumables",
    "Electricals",
    "Electronics",
    "Hardware",
    "Paints",
    "Plastics",
    "Raw Material",
    "Rubbers",
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">➕ Add Item</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Code */}
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Code"
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* ✅ Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <div className="flex gap-2">
              <select
                value={
                  formData.customCategoryMode ? "CUSTOM" : formData.category
                }
                onChange={(e) => {
                  if (e.target.value === "CUSTOM") {
                    setFormData((prev) => ({
                      ...prev,
                      category: "",
                      customCategoryMode: true,
                    }));
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                      customCategoryMode: false,
                    }));
                  }
                }}
                className="flex-1 border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              >
                <option value="">-- Select Category --</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="CUSTOM">+ Add New Category</option>
              </select>

              {formData.customCategoryMode && (
                <input
                  type="text"
                  placeholder="Enter Category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-40 border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                />
              )}
            </div>
          </div>

          {/* Description */}
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* Plant */}
          <input
            type="text"
            name="plantName"
            value={formData.plantName}
            onChange={handleChange}
            placeholder="Plant Name"
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* Weight */}
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Weight"
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* ✅ Unit Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <div className="flex gap-2">
              <select
                value={formData.customUnitMode ? "CUSTOM" : formData.unit}
                onChange={(e) => {
                  if (e.target.value === "CUSTOM") {
                    setFormData((prev) => ({
                      ...prev,
                      unit: "",
                      customUnitMode: true,
                    }));
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      unit: e.target.value,
                      customUnitMode: false,
                    }));
                  }
                }}
                className="flex-1 border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              >
                <option value="">-- Select Unit --</option>
                {unitOptions.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label} ({unit.value})
                  </option>
                ))}
                <option value="CUSTOM">+ Add New Unit</option>
              </select>

              {formData.customUnitMode && (
                <input
                  type="text"
                  placeholder="Enter Unit"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, unit: e.target.value }))
                  }
                  className="w-40 border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                />
              )}
            </div>
          </div>

          {/* Closing Quantity */}
          <input
            type="number"
            name="closingQty"
            value={formData.closingQty}
            onChange={handleChange}
            placeholder="Closing Quantity"
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* Store Location */}
          <select
            name="storeLocation"
            value={formData.storeLocation}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select Store Location</option>
            <option value="main store">Main Store</option>
            <option value="sub store">Sub Store</option>
          </select>

          {/* Remarks */}
          <select
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select Remarks</option>
            <option value="fast moving">Fast Moving</option>
            <option value="slow moving">Slow Moving</option>
            <option value="dead stock">Dead Stock</option>
          </select>

          {/* 🆕 Supplier Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Suppliers (Rate per unit)
            </label>
            {formData.suppliers.map((supplier, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Supplier Name"
                  value={supplier.name}
                  onChange={(e) =>
                    handleSupplierChange(index, "name", e.target.value)
                  }
                  className="flex-1 border px-3 py-2 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Rate per unit"
                  value={supplier.amount}
                  onChange={(e) =>
                    handleSupplierChange(index, "amount", e.target.value)
                  }
                  className="w-32 border px-3 py-2 rounded-lg"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeSupplier(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    ✖
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSupplier}
              className="text-blue-600 text-sm hover:underline mt-1"
            >
              + Add Supplier
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
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
