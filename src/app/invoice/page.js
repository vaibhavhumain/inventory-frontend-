"use client";
import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import VendorModal from "../../../components/VendorModal";
import InvoiceItemsTable from "../../../components/InvoiceItemsTable";
import NewItemModal from "../../../components/NewItemModal";
import API from "../../../utils/api";
import BackButton from "../../../components/BackButton";  
import { frontendLog } from "../../../utils/logger"; 
import {toast} from "sonner";
export default function InvoiceFormPage() {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [partyName, setPartyName] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [remarks, setRemarks] = useState("");
  const [vendors, setVendors] = useState([]);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [mannualInvoiceDate, setMannualInvoiceDate] = useState("");
  const [beforeTaxAmount, setBeforeTaxAmount] = useState(0);
  const [beforeTaxPercent, setBeforeTaxPercent] = useState(0);
  const [beforeTaxGstRate, setBeforeTaxGstRate] = useState(0);
  const [otherChargesAfterTax, setOtherChargesAfterTax] = useState(0);
  const [allItems, setAllItems] = useState([]);
  const [showNewItemModal, setShowNewItemModal] = useState(false);

  const [items, setItems] = useState([
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

  const unitOptions = [
    { value: "BAG", label: "BAG" },
    { value: "BDL", label: "BDL" },
    { value: "BOX", label: "BOX" },
    { value: "FEE", label: "FEE" },
    { value: "KG", label: "KG" },
    { value: "GRM", label: "GRM" },
    { value: "LTR", label: "LTR" },
    { value: "MTR", label: "MTR" },
    { value: "NOS", label: "NOS" },
    { value: "PAC", label: "PAC" },
    { value: "PCS", label: "PCS" },
    { value: "ROL", label: "ROL" },
    { value: "SET", label: "SET" },
    { value: "SQFT", label: "SQFT" },
    { value: "SQM", label: "SQM" },
  ];

  const [totalTaxableValue, setTotalTaxableValue] = useState(0);
  const [gstTotal, setGstTotal] = useState(0);
  const [totalInvoiceValue, setTotalInvoiceValue] = useState(0);
  const [beforeTaxBase, setBeforeTaxBase] = useState(0);
  const [beforeTaxGst, setBeforeTaxGst] = useState(0);

  useEffect(() => {
    async function fetchVendors() {
      try {
        const res = await API.get("/vendors");
        setVendors(res.data);
      } catch (err) {
        console.error("Error fetching vendors:", err);
      }
    }
    fetchVendors();
  }, []);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await API.get("/items");
        setAllItems(res.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    }
    fetchItems();
  }, []);

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

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vendorId) {
      toast.error("Please select a vendor before saving the invoice.");
      await frontendLog("warn", "Invoice submission blocked - vendor not selected");
      return;
    }

    const payload = {
      invoiceNumber,
      partyName,
      vendor: vendorId,
      date,
      mannualInvoiceDate,
      remarks,
      items,
      otherChargesBeforeTaxAmount: Number(beforeTaxAmount),
      otherChargesBeforeTaxGstRate: Number(beforeTaxGstRate),
      otherChargesAfterTax: Number(otherChargesAfterTax),
    };

    await frontendLog("info", "Attempting to save invoice", { invoiceNumber, vendorId });

    await toast.promise(
      API.post("/purchase-invoices", payload),
      {
        loading: "Saving invoice...",
        success: async (res) => {
          await frontendLog("info", "Invoice saved successfully", { id: res.data._id });
          return "Invoice saved successfully!";
        },
        error: async (err) => {
          await frontendLog("error", "Invoice save failed", {
            error: err.response?.data || err.message,
          });
          return "Save failed!";
        },
      },
      { position: "top-right", duration: 4000 }
    );
  };

  return (
    <div>
      <Navbar />
      <BackButton />
      <div className="p-8 bg-gray-50 min-h-screen w-full">

        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg p-6 w-full">
          {/* Header */}
         <div className="grid grid-cols-4 gap-4 mb-6 items-end">
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
    <div className="flex gap-2">
      <select
        value={vendorId}
        onChange={(e) => {
          const selectedVendor = vendors.find((v) => v._id === e.target.value);
          setVendorId(e.target.value);
          setPartyName(selectedVendor?.name || "");
        }}
        className="border p-2 rounded focus:ring focus:ring-blue-200"
        required
      >
        <option value="">-- Select Vendor --</option>
        {vendors.map((v) => (
          <option key={v._id} value={v._id}>
            {`${v.code} - ${v.name}`}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => setShowVendorModal(true)}
        className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        + Add
      </button>
    </div>
    {showVendorModal && (
      <VendorModal
        onClose={() => setShowVendorModal(false)}
        onSave={(newVendor) => {
          setVendors((prev) => [...prev, newVendor]);
          setVendorId(newVendor._id);
          setPartyName(newVendor.name);
        }}
      />
    )}
  </div>

  <div>
    <label className="block font-semibold mb-1">Date</label>
    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
      className="w-50 border p-2 rounded focus:ring focus:ring-blue-200"
    />
  </div>

  <div>
    <label className="block font-semibold mb-1">Invoice Date</label>
    <input
      type="date"
      value={mannualInvoiceDate}
      onChange={(e) => setMannualInvoiceDate(e.target.value)}
      className="w-80 border p-2 rounded focus:ring focus:ring-blue-200"
    />
  </div>
</div>


          {/* Items Table */}
          <InvoiceItemsTable
            items={items}
            setItems={setItems}
            allItems={allItems}
            unitOptions={unitOptions}
            onAddNewItem={() => setShowNewItemModal(true)}
          />

          {/* New Item Modal */}
          {showNewItemModal && (
            <NewItemModal
              onClose={() => setShowNewItemModal(false)}
              onSave={(newItem) => {
                setAllItems((prev) => [...prev, newItem]);

                setItems((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    item: newItem._id,
                    description: newItem.headDescription,
                    headDescription: newItem.headDescription,
                    subDescription: newItem.subDescription || "",
                    hsnCode: newItem.hsnCode || "",
                    gstRate: newItem.gstRate || 0,
                    subQuantityMeasurement: newItem.unit || "",
                  };
                  return updated;
                });
              }}
            />
          )}

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
