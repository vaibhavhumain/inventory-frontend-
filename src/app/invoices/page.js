"use client";
import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import InvoiceDetailModal from "../../../components/InvoiceDetailModal";
import BackButton from "../../../components/BackButton";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow sticky top-0 z-20">
        <Navbar />
        <BackButton/>
        <div className="px-8 py-4 border-t border-gray-200 flex justify-center">

        </div>
      </div>

      {/* ✅ Main Content */}
      <div className="p-8">
        {loading ? (
          <p className="text-center text-gray-500">Loading invoices...</p>
        ) : invoices.length === 0 ? (
          <p className="text-center text-gray-500">No invoices found.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="w-full border-collapse border">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "Invoice Number",
                    "Date",
                    "Vendor",
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
                    (inv.otherChargesBeforeTaxAmount || 0);
           
                  return (
                    <tr key={inv._id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{inv.invoiceNumber}</td>
                      <td className="border px-4 py-2">
                        {new Date(inv.date).toLocaleDateString()}
                      </td>
                      <td className="border px-4 py-2">
                        {inv.vendor
                          ? `${inv.vendor.code || ""} - ${inv.vendor.name || ""} (${inv.vendor.gstNumber || "No GST"})`
                          : "N/A"}
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
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ Invoice Detail Modal */}
      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
