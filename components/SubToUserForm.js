"use client";
import { useEffect, useState } from "react";
import API from "../utils/api";
import Navbar from "./Navbar";
import BusInfo from "./BusInfo";
import { toast } from "sonner";
import BackButton from "./BackButton";
export default function SubToUserForm() {
  const [issuedTo, setIssuedTo] = useState("");
  const [buses, setBuses] = useState([]); // All buses
  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherDate, setVoucherDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [items, setItems] = useState([
    { item: "", quantity: "", rate: "", busId: "" },
  ]);
  const [allItems, setAllItems] = useState([]);
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, summaryRes, userRes, busesRes] = await Promise.all([
          API.get("/items"),
          API.get("/stock/summary"),
          API.get("/auth/profile"),
          API.get("/buses"),
        ]);

        // Merge stock data
        const itemsWithStock = itemsRes.data.map((item) => {
          const stockRecords = summaryRes.data.filter(
            (s) => String(s.itemId) === String(item._id)
          );
          const latestRecord =
            stockRecords.length > 0
              ? stockRecords.reduce((a, b) =>
                  new Date(a.date) > new Date(b.date) ? a : b
                )
              : null;

          return {
            ...item,
            mainStoreQty: latestRecord?.closingMain || 0,
            subStoreQty: latestRecord?.closingSub || 0,
            closingQty: latestRecord?.closingTotal || 0,
          };
        });

        setAllItems(itemsWithStock);
        setUserName(userRes.data.name);
        setBuses(busesRes.data || []);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ When new bus is added
  const handleBusSaved = (savedBus) => {
    setBuses((prev) => {
      if (prev.find((b) => b._id === savedBus._id)) return prev;
      return [...prev, savedBus];
    });
    toast.success(`Bus ${savedBus.busCode} added to list.`);
  };

  // ✅ Handle item or bus change
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addRow = () =>
    setItems([...items, { item: "", quantity: "", rate: "", busId: "" }]);
  const removeRow = (i) => setItems(items.filter((_, idx) => idx !== i));

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!issuedTo.trim()) {
    toast.error("Please enter Issued To.");
    return;
  }
  if (!buses.length) {
    toast.error("Please add at least one bus first.");
    return;
  }
  if (items.some((it) => !it.item || !it.quantity || !it.busId)) {
    toast.error("Please fill all item fields and select Bus Code.");
    return;
  }

  // ✅ build payload properly
  const payload = {
    issueDate,
    voucherNumber,
    voucherDate,
    type: "SUB_TO_USER",
    department: "Sub Store",
    issuedTo,
    items: items.map((i) => {
      // 🟢 Fix: define selectedBus before returning
      const selectedBus = buses.find(
        (b) => b._id === i.busId || b.busCode === i.busId
      );

      return {
        item: i.item,
        quantity: Number(i.quantity),
        rate: Number(i.rate || 0),
        bus: selectedBus ? selectedBus._id : null, // ✅ always ObjectId
      };
    }),
  };

  try {
    const { data } = await API.post("/issue-bills/multi", payload);
    toast.success(data.message || "Issued successfully!");
    setIssuedTo("");
    setItems([{ item: "", quantity: "", rate: "", busId: "" }]);
  } catch (err) {
    console.error("Error creating issue bill:", err.response?.data);
    toast.error(err.response?.data?.error || "Error creating bill.");
  }
};


  return (
  <div>
    <Navbar />
    <BackButton />  
    <div className="max-w-full mx-auto mt-8 bg-white shadow-md p-6 rounded-lg border border-gray-200 relative">
      
      {/* 🕓 Issue Bill Date + Issued By (top-right corner) */}
      <div className="absolute top-4 right-6 text-xs text-gray-500">
        <span className="mr-1 font-medium">Issue Bill Date:</span>
        <input
          type="date"
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
          className="border rounded px-1 py-[2px] text-xs"
        />
        <div className="mt-1">
          <span className="text-sm text-gray-600">Issued By:</span>
          <span className="text-gray-700 font-semibold ml-1">
            {userName || "Fetching..."}
          </span>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">Sub → User</h2>

      {/* Voucher Info */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm text-gray-600">Voucher Number</label>
          <input
            type="text"
            placeholder="Enter Voucher Number"
            value={voucherNumber}
            onChange={(e) => setVoucherNumber(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Voucher Date</label>
          <input
            type="date"
            value={voucherDate}
            onChange={(e) => setVoucherDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Issued To</label>
          <input
            type="text"
            placeholder="Enter Name"
            value={issuedTo}
            onChange={(e) => setIssuedTo(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      {/* Add Bus Section */}
      <BusInfo onBusSaved={handleBusSaved} />

      {/* Items Table */}
      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr className="text-gray-700 font-semibold">
                <th className="border px-3 py-2 text-center">#</th>
                <th className="border px-3 py-2 text-center">Bus Code</th>
                <th className="border px-3 py-2 text-left">Item</th>
                <th className="border px-3 py-2 text-center">
                  Available (Sub)
                </th>
                <th className="border px-3 py-2 text-center">Qty</th>
                <th className="border px-3 py-2 text-center">Rate</th>
                <th className="border px-3 py-2 text-center">Amount</th>
                <th className="border px-3 py-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((it, idx) => {
                const selected = allItems.find((a) => a._id === it.item);
                const amount =
                  it.quantity && it.rate
                    ? (it.quantity * it.rate).toFixed(2)
                    : "";

                return (
                  <tr key={idx}>
                    <td className="border px-3 py-1 text-center">{idx + 1}</td>

                    {/* Bus Code Dropdown */}
                    <td className="border px-3 py-1 text-center">
                      <select
                        value={it.busId}
                        onChange={(e) =>
                          handleItemChange(idx, "busId", e.target.value)
                        }
                        className="border rounded p-1 text-sm w-full"
                        required
                      >
                        <option value="">Select Bus</option>
                        {buses.map((b) => (
                          <option key={b._id} value={b._id}>
                            {b.busCode} — {b.ownerName || "No Owner"}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Item Dropdown */}
                    <td className="border px-3 py-1">
                      <select
                        value={it.item}
                        onChange={(e) =>
                          handleItemChange(idx, "item", e.target.value)
                        }
                        className="w-full border-none focus:ring-0 focus:outline-none"
                        required
                      >
                        <option value="">Select Item</option>
                        {allItems.map((i) => (
                          <option key={i._id} value={i._id}>
                            {i.code} - {i.headDescription}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Stock Availability */}
                    <td className="border px-3 py-1 text-center text-green-600 font-semibold">
                      {selected
                        ? `${selected.subStoreQty} ${selected.unit || ""}`
                        : "-"}
                    </td>

                    {/* Qty */}
                    <td className="border px-3 py-1 text-center">
                      <input
                        type="number"
                        value={it.quantity}
                        onChange={(e) =>
                          handleItemChange(idx, "quantity", e.target.value)
                        }
                        className="w-20 border-none text-center"
                      />
                    </td>

                    {/* Rate */}
                    <td className="border px-3 py-1 text-center">
                      <input
                        type="number"
                        value={it.rate}
                        onChange={(e) =>
                          handleItemChange(idx, "rate", e.target.value)
                        }
                        className="w-20 border-none text-center"
                      />
                    </td>

                    {/* Amount */}
                    <td className="border px-3 py-1 text-center text-green-700 font-medium">
                      {amount}
                    </td>

                    {/* Remove */}
                    <td className="border px-3 py-1 text-center">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRow(idx)}
                          className="text-red-500 hover:underline"
                        >
                          ❌
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={addRow}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-sm"
          >
            ➕ Add Item Row
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Submit Issue
          </button>
        </div>
      </form>

      {message && (
        <p className="mt-4 text-center font-medium text-gray-700">{message}</p>
      )}
    </div>
  </div>
);
}