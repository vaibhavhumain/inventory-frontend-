"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import API from "../../../utils/api";
import SearchBar from "../../../components/SearchBar";

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
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
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

 const handleSearch = (query) => {
  setHasSearched(true);

  if (!query) {
    setFilteredItems([]);
    return;
  }

  const lower = query.toLowerCase();

  const results = items.filter((it) => {
    const combined =
      `${it.item} ${it.description} ${it.headQuantity} ${it.headQuantityMeasurement} 
       ${it.subQuantity} ${it.subQuantityMeasurement} ${it.hsnCode} ${it.rate} 
       ${it.amount} ${it.gstRate} ${it.partyName} ${it.date} ${it.location}`
        .toLowerCase();

    return combined.includes(lower);
  });

  setFilteredItems(results);
};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-[98%] mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          📦 Item Ledger
        </h1>

        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        {loading && (
          <p className="text-center text-gray-500">Loading items...</p>
        )}

        {!loading && hasSearched && (
          <div className="bg-white rounded-lg shadow border border-gray-300 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white text-xs uppercase">
                  <th className="border border-gray-300 px-3 py-2 text-left w-[50px]">
                    S.No
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left w-[120px]">
                    Code
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left w-[200px]">
                     Description
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center w-[100px]">
                    Head Qty
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center w-[100px]">
                    Head UOM
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center w-[100px]">
                    Sub Qty
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center w-[100px]">
                    Sub UOM
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center w-[100px]">
                    HSN Code
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-right w-[80px]">
                    Rate
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-right w-[100px]">
                    Amount
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center w-[70px]">
                    GST %
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center w-[120px]">
                    Party
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center w-[120px]">
                    Date
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center w-[120px]">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((it, index) => (
                    <tr
                      key={`${it.item}-${index}`}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-yellow-50 transition`}
                    >
                      <td className="border px-3 py-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border px-3 py-2 font-medium text-blue-700">
                        {it.code}
                      </td>
                      <td className="border px-3 py-2">{it.headDescription}</td>
                      <td className="border px-3 py-2 text-center">
                        {it.headQuantity}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {it.headQuantityMeasurement}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {it.subQuantity}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {it.subQuantityMeasurement}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {it.hsnCode}
                      </td>
                      <td className="border px-3 py-2 text-right">{it.rate}</td>
                      <td className="border px-3 py-2 text-right">
                        {it.amount}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {it.gstRate}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {it.partyName}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {new Date(it.date).toLocaleDateString("en-IN")}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {it.location}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="14"
                      className="px-4 py-6 text-center text-gray-500 italic"
                    >
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
