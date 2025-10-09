"use client";
import React from "react";

export default function InvoiceItemsTable({
  items,
  setItems,
  allItems,
  unitOptions,
  onAddNewItem,
}) {
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
        headDescription: "",
        subDescription: "",
        headQuantity: "",
        headQuantityMeasurement: "",
        subQuantity: "",
        subQuantityMeasurement: "",
        hsnCode: "",
        gstRate: "",
        rate: "",
        amount: 0,
        gstAmount: 0,
        total: 0,
      },
    ]);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemSelect = (idx, value) => {
    if (value === "__new__") {
      if (onAddNewItem) onAddNewItem(idx);
      return;
    }

    const selected = allItems.find(
      (i) => i._id === value || i.code === value
    );

    if (!selected) return;

    const newItems = [...items];
    newItems[idx] = {
      ...newItems[idx],
      item: value,
      headDescription: selected?.headDescription || "",
      subDescription: selected?.subDescription || "",
      description: selected?.subDescription || "",
      hsnCode: selected?.hsnCode || "",
      gstRate: selected?.gstRate || 0,
      headQuantityMeasurement: selected?.unit || "",
      subQuantityMeasurement: selected?.unit || "",
    };

    const subQty = parseFloat(newItems[idx].subQuantity) || 0;
    const rate = parseFloat(newItems[idx].rate) || 0;
    const amount = subQty * rate;
    const gstAmt = (amount * (selected?.gstRate || 0)) / 100;

    newItems[idx].amount = amount;
    newItems[idx].gstAmount = gstAmt;
    newItems[idx].total = amount + gstAmt;

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
              <td className="border px-2 py-1">
                <select
                  className="w-full border rounded p-1"
                  value={it.item}
                  onChange={(e) => handleItemSelect(idx, e.target.value)}
                >
                  <option value="">--Select Item--</option>
                  {allItems.map((i) => (
                    <option key={i._id || i.code} value={i._id || i.code}>
                      {i.code ? `${i.code} - ${i.headDescription}` : i.headDescription}
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

              <td className="border px-2 py-1">
                <input
                  className="w-full border rounded p-1"
                  value={it.subDescription}
                  onChange={(e) =>
                    handleItemChange(idx, "subDescription", e.target.value)
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

              <td className="border px-2 py-1 text-center">
                <input
                  className="w-full border rounded p-1 bg-gray-100 text-gray-600 text-center"
                  value={it.hsnCode}
                  readOnly
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

              <td className="border px-2 py-1 text-right">
                <input
                  type="number"
                  className="w-full border rounded p-1 bg-gray-100 text-gray-600 text-right"
                  value={it.gstRate}
                  readOnly
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
