"use client";
import { useEffect, useState } from "react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await fetch(
          "https://inventory-backend-o7iw.onrender.com/api/purchase-invoices"
        );
        const data = await res.json();
        setInvoices(data);
      } catch (err) {
        console.error("Error fetching invoices:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        All Purchase Invoices
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading invoices...</p>
      ) : invoices.length === 0 ? (
        <p className="text-center text-gray-500">No invoices found.</p>
      ) : (
        <table className="w-full border-collapse border shadow bg-white">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Invoice Number",
                "Date",
                "Party Name",
                "Taxable Value",
                "GST",
                "Total Value",
                "Actions",
              ].map((head) => (
                <th
                  key={head}
                  className="border px-4 py-2 text-left font-semibold"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => {
              const gstTax =
                (inv.totalInvoiceValue || 0) -
                (inv.totalTaxableValue || 0) -
                (inv.otherChargesAfterTax || 0) -
                (inv.otherChargesBeforeTax || 0);

              return (
                <tr key={inv._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{inv.invoiceNumber}</td>
                  <td className="border px-4 py-2">
                    {new Date(inv.date).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">{inv.partyName}</td>
                  <td className="border px-4 py-2 text-right">
                    {inv.totalTaxableValue?.toFixed(2)}
                  </td>
                  <td className="border px-4 py-2 text-right">
                    {gstTax.toFixed(2)}
                  </td>
                  <td className="border px-4 py-2 text-right font-semibold">
                    {inv.totalInvoiceValue?.toFixed(2)}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button className="text-blue-600 hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
