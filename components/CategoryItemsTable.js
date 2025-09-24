"use client";
import React, { useEffect, useState } from "react";
import API from "../utils/api";

export default function CategoryItemsTable() {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); 

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await API.get("/purchase-invoices");

        const allItems = res.data.flatMap((inv) =>
          inv.items.map((it) => {
            const itemDoc = it.item || {};
            return {
              code: itemDoc.code,
              headDescription: itemDoc.headDescription || "",
              subDescription: itemDoc.subDescription || it.overrideDescription || "",
              unit: itemDoc.unit || it.subQuantityMeasurement || "",
              hsnCode: it.hsnCode || itemDoc.hsnCode || "",
              headQuantity: it.headQuantity,
              headQuantityMeasurement: it.headQuantityMeasurement,
              subQuantity: it.subQuantity,
              subQuantityMeasurement: it.subQuantityMeasurement,
              rate: it.rate,
              amount: it.amount,
              gstRate: it.gstRate,
              notes: it.notes,
              invoiceNumber: inv.invoiceNumber,
              partyName: inv.partyName,
              date: inv.date,
              location: "Main Store",
            };
          })
        );

        setItems(allItems);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter(
    (item) => !selectedCategory || item.hsnCode === selectedCategory
  );

  const categories = [...new Set(items.map((item) => item.hsnCode))];

  return (
    <div className="bg-white rounded-lg shadow border border-gray-300">
      <div className="flex justify-between items-center px-4 py-3 cursor-pointer bg-blue-600 text-white rounded-t-lg"
           onClick={() => setOpen(!open)}>
        <h2 className="text-lg font-semibold">📦 Category Items Table</h2>
        <span className="text-sm">{open ? "▲ Hide" : "▼ Show"}</span>
      </div>

      {open && (
        <>
          <div className="flex items-center gap-4 p-4">
            <label className="text-sm font-medium text-gray-700">Filter by HSN</label>
            <select
              onChange={(e) => setSelectedCategory(e.target.value)}
              value={selectedCategory}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          {loading ? (
            <p className="text-center text-gray-500 py-4">Loading items...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-blue-600 text-white text-xs uppercase">
                    <th className="border px-3 py-2 text-center w-[50px]">S.No</th>
                    <th className="border px-3 py-2 text-left w-[100px]">Code</th>
                    <th className="border px-3 py-2 text-left w-[200px]">Head Desc</th>
                    <th className="border px-3 py-2 text-left w-[200px]">Sub Desc</th>
                    <th className="border px-3 py-2 text-center w-[90px]">Head Qty</th>
                    <th className="border px-3 py-2 text-center w-[90px]">Head UOM</th>
                    <th className="border px-3 py-2 text-center w-[90px]">Sub Qty</th>
                    <th className="border px-3 py-2 text-center w-[90px]">Sub UOM</th>
                    <th className="border px-3 py-2 text-center w-[90px]">HSN</th>
                    <th className="border px-3 py-2 text-right w-[80px]">Rate</th>
                    <th className="border px-3 py-2 text-right w-[100px]">Amount</th>
                    <th className="border px-3 py-2 text-center w-[70px]">GST %</th>
                    <th className="border px-3 py-2 text-center w-[120px]">Party</th>
                    <th className="border px-3 py-2 text-center w-[120px]">Date</th>
                    <th className="border px-3 py-2 text-center w-[120px]">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((it, index) => (
                      <tr
                        key={`${it.code}-${index}`}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-yellow-50 transition`}
                      >
                        <td className="border px-3 py-2 text-center">{index + 1}</td>
                        <td className="border px-3 py-2 font-medium text-blue-700">{it.code || "-"}</td>
                        <td className="border px-3 py-2">{it.headDescription || "-"}</td>
                        <td className="border px-3 py-2">{it.subDescription || "-"}</td>
                        <td className="border px-3 py-2 text-center">{it.headQuantity}</td>
                        <td className="border px-3 py-2 text-center">{it.headQuantityMeasurement}</td>
                        <td className="border px-3 py-2 text-center">{it.subQuantity}</td>
                        <td className="border px-3 py-2 text-center">{it.subQuantityMeasurement}</td>
                        <td className="border px-3 py-2 text-center">{it.hsnCode}</td>
                        <td className="border px-3 py-2 text-right">{it.rate}</td>
                        <td className="border px-3 py-2 text-right">{it.amount}</td>
                        <td className="border px-3 py-2 text-center">{it.gstRate}</td>
                        <td className="border px-3 py-2 text-center">{it.partyName}</td>
                        <td className="border px-3 py-2 text-center">
                          {new Date(it.date).toLocaleDateString("en-IN")}
                        </td>
                        <td className="border px-3 py-2 text-center">{it.location}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="15" className="px-4 py-6 text-center text-gray-500 italic">
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
