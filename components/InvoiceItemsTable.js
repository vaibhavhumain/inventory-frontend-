"use client";
import React from "react";

export default function InvoiceItemsTable({ items, setItems, allItems, unitOptions }) {
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

  const addItem = () => {
    setItems([
      ...items,
      {
        item: "",
        description: "",
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
        isNew: false,
      },
    ]);
  };

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
              "Description",
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
              <td className="border px-2 py-1">
                <select
                  className="w-full border rounded p-1"
                  value={it.item}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value === "__new__") {
                      handleItemChange(idx, "isNew", true);
                      handleItemChange(idx, "item", "");
                    } else {
                      handleItemChange(idx, "isNew", false);
                      handleItemChange(idx, "item", value);

                      const found = allItems.find((i) => i.code === value);
                      if (found) {
                        handleItemChange(idx, "description", found.description || "");
                        handleItemChange(idx, "hsnCode", found.category || "");
                        handleItemChange(idx, "subQuantityMeasurement", found.unit || "");
                      }
                    }
                  }}
                >
                  <option value="">--Select Item--</option>
                  {allItems.map((i) => (
                    <option key={i.code} value={i.code}>
                      {i.code} - {i.description}
                    </option>
                  ))}
                  <option value="__new__" className="text-green-700 font-semibold">
                    ➕ Add New Item
                  </option>
                </select>

                {it.isNew && (
                  <input
                    type="text"
                    placeholder="Enter new item code"
                    className="mt-1 w-full border rounded p-1"
                    value={it.item}
                    onChange={(e) => handleItemChange(idx, "item", e.target.value)}
                  />
                )}
              </td>

              <td className="border px-2 py-1">
                <input
                  className="w-full border rounded p-1"
                  value={it.description}
                  onChange={(e) =>
                    handleItemChange(idx, "description", e.target.value)
                  }
                />
              </td>
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
              <td className="border px-2 py-1">
                <select
                  className="w-full border rounded p-1"
                  value={it.headQuantityMeasurement}
                  onChange={(e) =>
                    handleItemChange(idx, "headQuantityMeasurement", e.target.value)
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
              <td className="border px-2 py-1">
                <input
                  className="w-full border rounded p-1"
                  value={it.hsnCode}
                  onChange={(e) => handleItemChange(idx, "hsnCode", e.target.value)}
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="number"
                  className="w-full border rounded p-1 text-right"
                  value={it.rate}
                  onChange={(e) => handleItemChange(idx, "rate", e.target.value)}
                />
              </td>
              <td className="border px-2 py-1 text-right">
                {it.amount.toFixed(2)}
              </td>
              <td className="border px-2 py-1">
                <input
                  type="number"
                  className="w-full border rounded p-1 text-right"
                  value={it.gstRate}
                  onChange={(e) => handleItemChange(idx, "gstRate", e.target.value)}
                />
              </td>
              <td className="border px-2 py-1 text-right">
                {it.gstAmount.toFixed(2)}
              </td>
              <td className="border px-2 py-1 text-right font-semibold">
                {it.total.toFixed(2)}
              </td>
              <td className="border px-2 py-1 text-center">
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-red-600 font-bold"
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
