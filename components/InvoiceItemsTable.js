"use client";
import React from "react";

export default function InvoiceItemsTable({
  items,
  setItems,
  allItems,
  unitOptions,
  onAddNewItem,
}) {
  // 🧮 Handle field updates and total calculations
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    const subQty = parseFloat(newItems[index].subQuantity) || 0;
    const rate = parseFloat(newItems[index].rate) || 0;
    const gstRate = parseFloat(newItems[index].gstRate) || 0;

    const amount = subQty * rate;
    const gstAmt = (amount * gstRate) / 100;
    const total = amount + gstAmt;

    newItems[index].amount = amount;
    newItems[index].gstAmount = gstAmt;
    newItems[index].total = total;

    setItems(newItems);
  };

  // ➕ Add new row
  const addItem = () => {
    setItems([
      ...items,
      {
        item: "",
        description: "",
        headDescription: "",
        subDescription: "",
        headQuantity: "",
        headQuantityMeasurement: "",
        subQuantity: "",
        subQuantityMeasurement: "",
        hsnCode: "",
        rate: "",
        gstRate: "",
        amount: 0,
        gstAmount: 0,
        total: 0,
      },
    ]);
  };

  // ❌ Remove a row
  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  return (
    <div>
      <table className="w-full text-sm border-collapse border mb-6">
        <thead className="bg-gray-100">
          <tr>
            {[
              "Item",
              "Sub Description",
              "Head Qty",
              "UQC",
              "Sub Qty",
              "UQC (Sub)",
              "HSN",
              "Rate",
              "TAXABLE",
              "GST %",
              "GST TAX",
              "TOTAL",
              "Actions",
            ].map((head) => (
              <th
                key={head}
                className="border px-3 py-2 text-center font-semibold"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {items.map((it, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {/* 🔹 Item Dropdown */}
              <td className="border px-2 py-1">
                <select
                  className="w-full border rounded p-1"
                  value={it.item}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value === "__new__") {
                      if (onAddNewItem) onAddNewItem(idx);
                      return;
                    }

                    const selected = allItems.find(
                      (i) => i._id === value || i.code === value
                    );

                    const newItems = [...items];
                    newItems[idx] = {
                      ...newItems[idx],
                      item: value,
                      description: selected?.subDescription || "",
                      headDescription: selected?.headDescription || "",
                      subDescription: selected?.subDescription || "",
                      // ✅ auto-fill HSN only if backend provides it
                      hsnCode: selected?.hsnCode || newItems[idx].hsnCode,
                      headQuantityMeasurement: selected?.unit || "",
                      subQuantityMeasurement: selected?.unit || "",
                    };

                    setItems(newItems);
                  }}
                >
                  <option value="">--Select Item--</option>
                  {allItems.map((i) => (
                    <option key={i._id || i.code} value={i._id || i.code}>
                      {i.headDescription}
                    </option>
                  ))}
                  <option
                    value="__new__"
                    className="text-green-700 font-semibold"
                  >
                    ➕ Add New Item
                  </option>
                </select>
              </td>

              {/* 🔹 Sub Description */}
              <td className="border px-2 py-1">
                <input
                  className="w-full border rounded p-1"
                  value={it.description}
                  onChange={(e) =>
                    handleItemChange(idx, "description", e.target.value)
                  }
                />
              </td>

              {/* Head Quantity */}
              <td className="border px-2 py-1">
                <input
                  type="number"
                  className="w-full border rounded p-1 text-right"
                  value={it.headQuantity}
                  onChange={(e) =>
                    handleItemChange(idx, "headQuantity", e.target.value)
                  }
                />
              </td>

              {/* Head UQC */}
              <td className="border px-2 py-1">
                <select
                  className="w-full border rounded p-1"
                  value={it.headQuantityMeasurement}
                  onChange={(e) =>
                    handleItemChange(
                      idx,
                      "headQuantityMeasurement",
                      e.target.value
                    )
                  }
                >
                  <option value="">--Select--</option>
                  {unitOptions.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </td>

              {/* Sub Quantity */}
              <td className="border px-2 py-1">
                <input
                  type="number"
                  className="w-full border rounded p-1 text-right"
                  value={it.subQuantity}
                  onChange={(e) =>
                    handleItemChange(idx, "subQuantity", e.target.value)
                  }
                />
              </td>

              {/* Sub UQC */}
              <td className="border px-2 py-1">
                <select
                  className="w-full border rounded p-1"
                  value={it.subQuantityMeasurement}
                  onChange={(e) =>
                    handleItemChange(
                      idx,
                      "subQuantityMeasurement",
                      e.target.value
                    )
                  }
                >
                  <option value="">--Select--</option>
                  {unitOptions.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </td>

              {/* 🧾 HSN Code (editable but auto-filled if available) */}
              <td className="border px-2 py-1">
                <input
                  className="w-full border rounded p-1 text-center"
                  placeholder="Enter HSN"
                  value={it.hsnCode}
                  onChange={(e) =>
                    handleItemChange(idx, "hsnCode", e.target.value)
                  }
                />
              </td>

              {/* Rate */}
              <td className="border px-2 py-1">
                <input
                  type="number"
                  className="w-full border rounded p-1 text-right"
                  value={it.rate}
                  onChange={(e) =>
                    handleItemChange(idx, "rate", e.target.value)
                  }
                />
              </td>

              {/* Taxable */}
              <td className="border px-2 py-1 text-right">
                {it.amount.toFixed(2)}
              </td>

              {/* GST Rate */}
              <td className="border px-2 py-1">
                <input
                  type="number"
                  className="w-full border rounded p-1 text-right"
                  value={it.gstRate}
                  onChange={(e) =>
                    handleItemChange(idx, "gstRate", e.target.value)
                  }
                />
              </td>

              {/* GST TAX */}
              <td className="border px-2 py-1 text-right">
                {it.gstAmount.toFixed(2)}
              </td>

              {/* TOTAL */}
              <td className="border px-2 py-1 text-right font-semibold">
                {it.total.toFixed(2)}
              </td>

              {/* Actions */}
              <td className="border px-2 py-1 text-center">
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-red-600 font-bold hover:text-red-800"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        type="button"
        onClick={addItem}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 mb-6"
      >
        + Add Item
      </button>
    </div>
  );
}
