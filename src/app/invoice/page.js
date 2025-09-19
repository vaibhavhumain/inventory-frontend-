"use client";
import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
export default function InvoiceFormPage() {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [partyName, setPartyName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [remarks, setRemarks] = useState("");

  // other charges
  const [beforeTaxAmount, setBeforeTaxAmount] = useState(0);
  const [beforeTaxPercent, setBeforeTaxPercent] = useState(0);
  const [beforeTaxGstRate, setBeforeTaxGstRate] = useState(0);
  const [otherChargesAfterTax, setOtherChargesAfterTax] = useState(0);

  const [items, setItems] = useState([
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
    },
  ]);

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

  const [totalTaxableValue, setTotalTaxableValue] = useState(0);
  const [gstTotal, setGstTotal] = useState(0);
  const [totalInvoiceValue, setTotalInvoiceValue] = useState(0);

  // derived values for other charges
  const [beforeTaxBase, setBeforeTaxBase] = useState(0);
  const [beforeTaxGst, setBeforeTaxGst] = useState(0);

  useEffect(() => {
    let taxable = 0;
    let gst = 0;

    items.forEach((it) => {
      taxable += it.amount || 0;
      gst += it.gstAmount || 0;
    });

    const base =
      (parseFloat(beforeTaxAmount) || 0) +
      (taxable * (parseFloat(beforeTaxPercent) || 0)) / 100;

    const gstExtra = (base * (parseFloat(beforeTaxGstRate) || 0)) / 100;

    setBeforeTaxBase(base);
    setBeforeTaxGst(gstExtra);

    setTotalTaxableValue(taxable + base);
    setGstTotal(gst + gstExtra);
    setTotalInvoiceValue(
      taxable + base + gst + gstExtra + (parseFloat(otherChargesAfterTax) || 0)
    );
  }, [items, beforeTaxAmount, beforeTaxPercent, beforeTaxGstRate, otherChargesAfterTax]);

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
      },
    ]);
  };

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

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      invoiceNumber,
      partyName,
      date,
      remarks,
      items,
      otherChargesBeforeTaxAmount: Number(beforeTaxAmount),
      otherChargesBeforeTaxPercent: Number(beforeTaxPercent),
      otherChargesBeforeTaxGstRate: Number(beforeTaxGstRate),
      otherChargesAfterTax: Number(otherChargesAfterTax),
    };

    try {
      const res = await fetch(
        "https://inventory-backend-o7iw.onrender.com/api/purchase-invoices",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      alert("Invoice saved successfully!");
      console.log("Saved:", data);
    } catch (err) {
      console.error("Error saving invoice:", err);
    }
  };

  return (
    <div>
        <Navbar />
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Create Purchase Invoice
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-lg p-6 w-full"
      >
        {/* Header */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block font-semibold mb-1">Invoice Number</label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full border p-2 rounded focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Party Name</label>
            <input
              type="text"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              className="w-full border p-2 rounded focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border p-2 rounded focus:ring focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Items Table */}
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
                  <input
                    className="w-full border rounded p-1"
                    value={it.item}
                    onChange={(e) =>
                      handleItemChange(idx, "item", e.target.value)
                    }
                  />
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
                <td className="border px-2 py-1">
                  <input
                    className="w-full border rounded p-1"
                    value={it.hsnCode}
                    onChange={(e) =>
                      handleItemChange(idx, "hsnCode", e.target.value)
                    }
                  />
                </td>
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
                <td className="border px-2 py-1 text-right">
                  {it.amount.toFixed(2)}
                </td>
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

        {/* Summary */}
        <div className="border-t pt-4 mt-4 space-y-3 w-full">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Other Charges Before Tax</span>
            <div className="flex space-x-2">
              <input
                type="number"
                value={beforeTaxAmount}
                onChange={(e) => setBeforeTaxAmount(e.target.value)}
                placeholder="₹ Amount"
                className="border p-2 rounded w-28 text-right"
              />

              <input
                type="number"
                value={beforeTaxGstRate}
                onChange={(e) => setBeforeTaxGstRate(e.target.value)}
                placeholder="GST %"
                className="border p-2 rounded w-20 text-right"
              />
            </div>
          </div>

          <div className="flex justify-between font-semibold">
            <span>Other Charges Before Tax (Total)</span>
            <span>{beforeTaxBase.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-semibold">
            <span>GST on Other Charges</span>
            <span>{beforeTaxGst.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-semibold">
            <span>Taxable Value</span>
            <span>{totalTaxableValue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>GST TAX</span>
            <span>{gstTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold">Other Charges After Tax</span>
            <input
              type="number"
              value={otherChargesAfterTax}
              onChange={(e) => setOtherChargesAfterTax(e.target.value)}
              className="border p-2 rounded w-32 text-right"
            />
          </div>

          <div className="flex justify-between font-bold text-xl text-blue-700 mt-4">
            <span>Total Invoice Value</span>
            <span>{totalInvoiceValue.toFixed(2)}</span>
          </div>
        </div>

        {/* Remarks */}
        <div className="mt-6">
          <label className="block font-semibold mb-1">Remarks</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full border p-2 rounded h-20"
          />
        </div>

        {/* Submit */}
            <div className="text-center mt-8">
            <button
                type="submit"
                className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg shadow hover:bg-green-700"
            >
                Save Invoice
            </button>
            </div>
        </form>
        </div>
        </div>
  );
}
