"use client";
import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import VendorModal from "../../../components/VendorModal";
import InvoiceItemsTable from "../../../components/InvoiceItemsTable";
import NewItemModal from "../../../components/NewItemModal";
import API from "../../../utils/api";
import {toast} from "sonner";
export default function InvoiceFormPage() {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [partyName, setPartyName] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [remarks, setRemarks] = useState("");
  const [vendors, setVendors] = useState([]);
  const [showVendorModal, setShowVendorModal] = useState(false);

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
    { value: "BAG", label: "Bag" },
    { value: "BDL", label: "Bundles" },
    { value: "BOX", label: "Boxes" },
    { value: "FEE", label: "Feets" },
    { value: "KG", label: "Kilogram" },
    { value: "GRM", label: "Grams" },
    { value: "LTR", label: "Litre" },
    { value: "MTR", label: "Meter" },
    { value: "NOS", label: "Numbers" },
    { value: "PAC", label: "Packet" },
    { value: "PCS", label: "Pieces" },
    { value: "ROL", label: "Rolls" },
    { value: "SET", label: "Sets" },
    { value: "SQFT", label: "Square Feet" },
    { value: "SQM", label: "Square Meters" },
  ];

  const [totalTaxableValue, setTotalTaxableValue] = useState(0);
  const [gstTotal, setGstTotal] = useState(0);
  const [totalInvoiceValue, setTotalInvoiceValue] = useState(0);
  const [beforeTaxBase, setBeforeTaxBase] = useState(0);
  const [beforeTaxGst, setBeforeTaxGst] = useState(0);

  // Fetch vendors
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

  // Fetch items
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

  // Totals
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
    return;
  }

  const cleanItems = items.map(({ isNew, amount, gstAmount, total, ...rest }) => ({
    ...rest,
    headDescription: rest.headDescription || rest.description || "",
    subDescription: rest.subDescription || "",
    headQuantity: Number(rest.headQuantity) || 0,
    subQuantity: Number(rest.subQuantity) || 0,
    rate: Number(rest.rate) || 0,
    gstRate: Number(rest.gstRate) || 0,
  }));

  const payload = {
    invoiceNumber,
    partyName,
    vendor: vendorId,
    date,
    remarks,
    items: cleanItems,
    otherChargesBeforeTaxAmount: Number(beforeTaxAmount),
    otherChargesBeforeTaxPercent: Number(beforeTaxPercent),
    otherChargesBeforeTaxGstRate: Number(beforeTaxGstRate),
    otherChargesAfterTax: Number(otherChargesAfterTax),
  };

  console.log("Submitting payload:", payload);

  await toast.promise(
    API.post("/purchase-invoices", payload),
    {
      loading: "Saving invoice...",
      success: (res) => {
        console.log("Saved:", res.data);
        setTimeout(() => {
          setInvoiceNumber("");
          setPartyName("");
          setVendorId("");
          setRemarks("");
          setBeforeTaxAmount(0);
          setBeforeTaxPercent(0);
          setBeforeTaxGstRate(0);
          setOtherChargesAfterTax(0);
          setItems([
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
          setTotalTaxableValue(0);
          setGstTotal(0);
          setTotalInvoiceValue(0);
          setBeforeTaxBase(0);
          setBeforeTaxGst(0);
        }, 1000);
        return "Invoice saved successfully!";
      },
      error: (err) => {
        console.error("Error saving invoice:", err.response?.data || err.message);
        return err.response?.data?.error || "Save failed!";
      },
    },
    { position: "top-right", duration: 4000 }
  );
};



  return (
    <div>
      <Navbar />
      <div className="p-8 bg-gray-50 min-h-screen w-full">

        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg p-6 w-full">
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
                      {v.name}
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
                className="w-full border p-2 rounded focus:ring focus:ring-blue-200"
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
