"use client";
import { X } from "lucide-react";

export default function InvoiceDetailModal({ invoice, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg overflow-y-auto max-h-[90vh] p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Purchase Invoice - {invoice.invoiceNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Vendor & Party Info */}
        <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">Vendor Details</h3>
            <p>{invoice.vendor?.name || "-"}</p>
            <p>GST: {invoice.vendor?.gstNumber || "N/A"}</p>
            <p>Code: {invoice.vendor?.code || "-"}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">Party Details</h3>
            <p>{invoice.partyName}</p>
            <p>Date: {new Date(invoice.date).toLocaleDateString("en-IN")}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">S.No</th>
                <th className="border px-3 py-2 text-left">Description</th>
                <th className="border px-3 py-2 text-center">HSN</th>
                <th className="border px-3 py-2 text-center">Head Qty</th>
                <th className="border px-3 py-2 text-center">Sub Qty</th>
                <th className="border px-3 py-2 text-center">Rate</th>
                <th className="border px-3 py-2 text-center">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((it, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{idx + 1}</td>
                  <td className="border px-3 py-2">
                    {it.description || it.item?.headDescription || "-"}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {it.hsnCode || "-"}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {it.headQuantity} {it.headQuantityMeasurement || ""}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {it.subQuantity} {it.subQuantityMeasurement || ""}
                  </td>
                  <td className="border px-3 py-2 text-right">
                    {it.rate?.toFixed(2)}
                  </td>
                  <td className="border px-3 py-2 text-right">
                    {it.amount?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end text-sm">
          <table className="w-1/2 border">
            <tbody>
              <tr>
                <td className="border px-3 py-2">Taxable Value</td>
                <td className="border px-3 py-2 text-right">
                  {invoice.totalTaxableValue?.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="border px-3 py-2">GST</td>
                <td className="border px-3 py-2 text-right">
                  {(
                    (invoice.totalInvoiceValue || 0) -
                    (invoice.totalTaxableValue || 0)
                  ).toFixed(2)}
                </td>
              </tr>
              {invoice.otherChargesBeforeTaxAmount > 0 && (
                <tr>
                  <td className="border px-3 py-2">Other Charges (Before Tax)</td>
                  <td className="border px-3 py-2 text-right">
                    {invoice.otherChargesBeforeTaxAmount.toFixed(2)}
                  </td>
                </tr>
              )}
              {invoice.otherChargesAfterTax > 0 && (
                <tr>
                  <td className="border px-3 py-2">Other Charges (After Tax)</td>
                  <td className="border px-3 py-2 text-right">
                    {invoice.otherChargesAfterTax.toFixed(2)}
                  </td>
                </tr>
              )}
              <tr className="bg-gray-100 font-semibold">
                <td className="border px-3 py-2">Total Invoice Value</td>
                <td className="border px-3 py-2 text-right">
                  {invoice.totalInvoiceValue?.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer / Signature */}
        <div className="mt-8 flex justify-between items-center text-sm">
          <p className="text-gray-600">This is a system-generated invoice.</p>
          <div className="text-right">
            <p className="font-semibold">Authorized Signatory</p>
            <div className="mt-6 border-t border-gray-400 w-40 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
