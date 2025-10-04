"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import API from "../../../utils/api";
import SearchBar from "../../../components/SearchBar";
import Link from "next/link";

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const sortByCode = (arr) => {
    const regex = /^([A-Za-z]+)\/?(\d+)$/;
    return arr.sort((a, b) => {
      const matchA = a.code.match(regex);
      const matchB = b.code.match(regex);

      if (!matchA || !matchB) return a.code.localeCompare(b.code);

      const prefixA = matchA[1];
      const prefixB = matchB[1];
      const numA = parseInt(matchA[2], 10);
      const numB = parseInt(matchB[2], 10);

      if (prefixA !== prefixB) return prefixA.localeCompare(prefixB);

      return numA - numB;
    });
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await API.get("/purchase-invoices");

      const allItems = res.data.flatMap((inv) =>
        inv.items.map((it) => {
          const itemDoc = it.item || {};
          return {
            id: itemDoc._id,
            code: itemDoc.code || "",
            headDescription: itemDoc.headDescription || "",
            subDescription:
              itemDoc.subDescription || it.overrideDescription || "",
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

      const grouped = Object.values(
        allItems.reduce((acc, it) => {
          if (!acc[it.code]) {
            acc[it.code] = {
              ...it,
              invoices: [
                {
                  invoiceNumber: it.invoiceNumber,
                  partyName: it.partyName,
                  date: it.date,
                  rate: it.rate,
                  amount: it.amount,
                  subQuantity: it.subQuantity,
                  gstRate: it.gstRate,
                },
              ],
            };
          } else {
            acc[it.code].invoices.push({
              invoiceNumber: it.invoiceNumber,
              partyName: it.partyName,
              date: it.date,
              rate: it.rate,
              amount: it.amount,
              subQuantity: it.subQuantity,
              gstRate: it.gstRate,
            });

            acc[it.code].subQuantity += it.subQuantity;
            acc[it.code].amount += it.amount;
          }
          return acc;
        }, {})
      );

      setItems(sortByCode(grouped));
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
      const combined = `
        ${it.code}
        ${it.headDescription}
        ${it.subDescription}
        ${it.hsnCode}
      `.toLowerCase();
      return combined.includes(lower);
    });

    setFilteredItems(sortByCode(results));
  };

  const toggleExpand = (code) => {
    setExpandedRow(expandedRow === code ? null : code);
  };

  const displayedItems = filteredItems.length > 0 ? filteredItems : items;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-[98%] mx-auto px-4 py-6">
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
                  <th className="border px-3 py-2 text-left w-[50px]">S.No</th>
                  <th className="border px-3 py-2 text-left w-[120px]">Code</th>
                  <th className="border px-3 py-2 text-left w-[200px]">
                    Description
                  </th>
                  <th className="border px-3 py-2 text-center w-[100px]">
                    Total Qty
                  </th>
                  <th className="border px-3 py-2 text-right w-[100px]">
                    Amount
                  </th>
                  <th className="border px-3 py-2 text-center w-[80px]">
                    More
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedItems.length > 0 ? (
                  displayedItems.map((it, index) => (
                    <React.Fragment key={it.code}>
                      <tr
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-yellow-50 transition`}
                      >
                        <td className="border px-3 py-2 text-center">
                          {index + 1}
                        </td>
                        <td className="border px-3 py-2 font-medium text-blue-700">
                          <Link href={`/items/${it.id}`}>{it.code}</Link>
                        </td>
                        <td className="border px-3 py-2">
                          {it.headDescription}
                        </td>
                        <td className="border px-3 py-2 text-center">
                          {it.subQuantity}
                        </td>
                        <td className="border px-3 py-2 text-right">
                          ₹{it.amount}
                        </td>
                        <td
                          className="border px-3 py-2 text-center cursor-pointer text-blue-600 underline"
                          onClick={() => toggleExpand(it.code)}
                        >
                          {expandedRow === it.code ? "Hide" : "View"}
                        </td>
                      </tr>

                      {expandedRow === it.code && (
                        <tr>
                          <td colSpan="6" className="bg-gray-50 p-3">
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs border">
                                <thead className="bg-gray-200">
                                  <tr>
                                    <th className="border px-2 py-1">Invoice</th>
                                    <th className="border px-2 py-1">Party</th>
                                    <th className="border px-2 py-1">Date</th>
                                    <th className="border px-2 py-1 text-right">
                                      Qty
                                    </th>
                                    <th className="border px-2 py-1 text-right">
                                      Rate
                                    </th>
                                    <th className="border px-2 py-1 text-right">
                                      GST %
                                    </th>
                                    <th className="border px-2 py-1 text-right">
                                      Amount
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {it.invoices.map((inv, idx) => (
                                    <tr key={idx}>
                                      <td className="border px-2 py-1">
                                        {inv.invoiceNumber}
                                      </td>
                                      <td className="border px-2 py-1">
                                        {inv.partyName}
                                      </td>
                                      <td className="border px-2 py-1">
                                        {new Date(inv.date).toLocaleDateString(
                                          "en-IN"
                                        )}
                                      </td>
                                      <td className="border px-2 py-1 text-right">
                                        {inv.subQuantity}
                                      </td>
                                      <td className="border px-2 py-1 text-right">
                                        ₹{inv.rate}
                                      </td>
                                      <td className="border px-2 py-1 text-right">
                                        {inv.gstRate}%
                                      </td>
                                      <td className="border px-2 py-1 text-right">
                                        ₹{inv.amount}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
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
