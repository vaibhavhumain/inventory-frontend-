import { useState } from "react";

export default function AddItemForm({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    code: "",
    category: "",
    description: "",
    plantName: "",
    weight: "",
    unit: "",
    customUnitMode: false, // ✅ new state flag for custom unit input
    closingQty: "",
    storeLocation: "",
    remarks: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      weight: formData.weight ? Number(formData.weight) : undefined,
      closingQty: formData.closingQty ? Number(formData.closingQty) : 0,
      unit: formData.unit?.trim()
    });
  };

  // ✅ Available units (dropdown options)
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
    { value: "SQM", label: "Square Meters" }
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">➕ Add Item</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* existing fields */}
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Code"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="text"
            name="plantName"
            value={formData.plantName}
            onChange={handleChange}
            placeholder="Plant Name"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Weight"
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* ✅ Unit Dropdown with custom option */}
          <div>
            <div className="flex gap-2">
              <select
                value={formData.customUnitMode ? "CUSTOM" : formData.unit}
                onChange={(e) => {
                  if (e.target.value === "CUSTOM") {
                    setFormData((prev) => ({
                      ...prev,
                      unit: "",
                      customUnitMode: true
                    }));
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      unit: e.target.value,
                      customUnitMode: false
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

              {/* Show input if user chooses custom unit */}
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

          <input
            type="number"
            name="closingQty"
            value={formData.closingQty}
            onChange={handleChange}
            placeholder="Closing Quantity"
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* Store Location dropdown */}
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

          {/* Remarks dropdown */}
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

          {/* buttons */}
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
