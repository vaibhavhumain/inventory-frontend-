"use client";
import { useEffect, useState } from "react";
import API from "../utils/api";
import Navbar from "./Navbar";
import BackButton from "./BackButton";

export default function MainToSubForm() {
  const [department, setDepartment] = useState("");
  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherDate, setVoucherDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [items, setItems] = useState([{ item: "", quantity: "", rate: "" }]);
  const [allItems, setAllItems] = useState([]);
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");

  // 🟢 Fetch items + user
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, summaryRes, userRes] = await Promise.all([
          API.get("/items"),
          API.get("/stock/summary"),
          API.get("/auth/profile"),
        ]);

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
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // 🟢 Item Change
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addRow = () => setItems([...items, { item: "", quantity: "", rate: "" }]);
  const removeRow = (i) => setItems(items.filter((_, idx) => idx !== i));

  // 🟢 Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!department.trim()) {
      setMessage("❌ Please enter department.");
      return;
    }

    if (items.some((it) => !it.item || !it.quantity)) {
      setMessage("❌ Please select an item and enter valid quantity.");
      return;
    }

    const payload = {
      issueDate: new Date(issueDate),
      type: "MAIN_TO_SUB",
      department,
      voucherNumber: voucherNumber || undefined,
      voucherDate: new Date(voucherDate),
      items: items.map((i) => ({
        item: i.item,
        quantity: Number(i.quantity),
        rate: Number(i.rate || 0),
      })),
    };

    try {
      const { data } = await API.post("/issue-bills", payload);
      setMessage("✅ " + (data.message || "Issued successfully!"));
      setDepartment("");
      setVoucherNumber("");
      setVoucherDate(new Date().toISOString().split("T")[0]);
      setIssueDate(new Date().toISOString().split("T")[0]);
      setItems([{ item: "", quantity: "", rate: "" }]);
    } catch (err) {
      console.error("Error creating issue bill:", err);
      setMessage("❌ " + (err.response?.data?.error || "Error creating bill"));
    }
  };

  return (
    <div>
      <Navbar />
      <BackButton />
      <div className="max-w-full mx-auto mt-8 bg-white shadow-md p-6 rounded-lg border border-gray-200 relative">
        {/* 🕓 Issue Bill Date + Issued By (top-right small section) */}
        <div className="absolute top-4 right-6 flex flex-col items-end text-xs text-gray-500">
          <div>
            <span className="font-medium">Issue Bill Date: </span>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="border rounded px-1 py-[2px] text-xs ml-1"
            />
          </div>
          <div className="mt-1">
            <span className="font-medium">Issued By: </span>
            <span className="text-gray-700 font-semibold">
            <strong> {userName || "Loading..."}</strong> 
            </span>
          </div>
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Main → Sub</h2>

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
            <label className="text-sm text-gray-600">Department</label>
            <input
              type="text"
              placeholder="Enter Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
        </div>

        {/* Main Table */}
        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr className="text-gray-700 font-semibold">
                  <th className="border px-3 py-2 text-center">#</th>
                  <th className="border px-3 py-2 text-left">Item Name</th>
                  <th className="border px-3 py-2 text-center">Available (Main)</th>
                  <th className="border px-3 py-2 text-center">Qty</th>
                  <th className="border px-3 py-2 text-center">Unit</th>
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

                      <td className="border px-3 py-1 text-center text-green-600 font-semibold">
                        {selected ? `${selected.mainStoreQty} ${selected.unit}` : "-"}
                      </td>

                      <td className="border px-3 py-1 text-center">
                        <input
                          type="number"
                          value={it.quantity}
                          onChange={(e) =>
                            handleItemChange(idx, "quantity", e.target.value)
                          }
                          className="w-20 border-none text-center"
                          required
                        />
                      </td>

                      <td className="border px-3 py-1 text-center text-gray-600">
                        {selected?.unit || "-"}
                      </td>

                      <td className="border px-3 py-1 text-center">
                        <input
                          type="number"
                          value={it.rate}
                          onChange={(e) =>
                            handleItemChange(idx, "rate", e.target.value)
                          }
                          className="w-24 border-none text-center"
                        />
                      </td>

                      <td className="border px-3 py-1 text-center text-green-700 font-medium">
                        {amount}
                      </td>

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

          {/* Add Row */}
          <div className="mt-3">
            <button
              type="button"
              onClick={addRow}
              className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-sm"
            >
              ➕ Add Row
            </button>
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Submit
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
