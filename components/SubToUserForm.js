"use client";
import { useEffect, useState } from "react";
import API from "../utils/api";
import Navbar from "./Navbar";

export default function SubToUserForm() {
  const [issuedTo, setIssuedTo] = useState("");
  const [busCode, setBusCode] = useState("");
  const [items, setItems] = useState([{ item: "", quantity: "", rate: "" }]);
  const [allItems, setAllItems] = useState([]);
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");

  // 🔹 Fetch items with stock + logged-in user
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, summaryRes, userRes] = await Promise.all([
          API.get("/items"),
          API.get("/stock/summary"),
          API.get("/auth/profile"),
        ]);

        // merge stock summary into items
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
        console.error("Error loading items or user:", err);
      }
    };

    fetchData();
  }, []);

  // Row Handlers
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addRow = () =>
    setItems([...items, { item: "", quantity: "", rate: "" }]);

  const removeRow = (i) => setItems(items.filter((_, idx) => idx !== i));

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!busCode.trim() || !issuedTo.trim()) {
      setMessage("❌ Please enter both Bus Code and Issued To.");
      return;
    }
    if (items.some((it) => !it.item || !it.quantity)) {
      setMessage("❌ Please select an item and enter valid quantity.");
      return;
    }

    const payload = {
      issueDate: new Date(),
      type: "SUB_TO_USER",
      department: "Sub Store",
      issuedTo,
      bus: { busCode },
      items: items.map((i) => ({
        item: i.item,
        quantity: Number(i.quantity),
        rate: Number(i.rate || 0),
      })),
    };

    try {
      const { data } = await API.post("/issue-bills", payload);
      setMessage("✅ " + (data.message || "Issued successfully!"));
      setBusCode("");
      setIssuedTo("");
      setItems([{ item: "", quantity: "", rate: "" }]);
    } catch (err) {
      console.error("Error creating issue bill:", err.response?.data);
      setMessage("❌ " + (err.response?.data?.error || "Error creating bill"));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-full mx-auto mt-8 bg-white shadow-md p-6 rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Sub → User</h2>

        {/* Voucher Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm text-gray-600">Issued To</label>
            <input
              type="text"
              placeholder="Enter Department or User"
              value={issuedTo}
              onChange={(e) => setIssuedTo(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Date</label>
            <input
              type="date"
              value={new Date().toISOString().split("T")[0]}
              className="border p-2 rounded w-full bg-gray-100"
              disabled
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr className="text-gray-700 font-semibold">
                  <th className="border px-3 py-2 text-center">Sr No</th>
                  <th className="border px-3 py-2 text-left">Bus Code</th>
                  <th className="border px-3 py-2 text-left">Item Name</th>
                  <th className="border px-3 py-2 text-center">Available</th>
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
                    <tr key={idx} className="text-gray-800">
                      <td className="border px-3 py-1 text-center">{idx + 1}</td>

                      {/* Bus Code */}
                      <td className="border px-3 py-1">
                        <input
                          type="text"
                          value={busCode}
                          onChange={(e) => setBusCode(e.target.value)}
                          placeholder="Enter Bus Code"
                          className="w-full border-none focus:ring-0 focus:outline-none"
                          required
                        />
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
                      <td className="border px-3 py-1 text-center text-green-600 font-semibold">
                        {selected ? `${selected.subStoreQty} ${selected.unit || "pcs"}` : "-"}
                      </td>
z
                      {/* Quantity */}
                      <td className="border px-3 py-1 text-center">
                        <input
                          type="number"
                          value={it.quantity}
                          onChange={(e) =>
                            handleItemChange(idx, "quantity", e.target.value)
                          }
                          className="w-20 border-none text-center focus:ring-0 focus:outline-none"
                          required
                        />
                      </td>

                      {/* Unit */}
                      <td className="border px-3 py-1 text-center text-gray-600">
                        {selected?.unit || "-"}
                      </td>
                      {/* Rate */}
                      <td className="border px-3 py-1 text-center">
                        <input
                          type="number"
                          value={it.rate}
                          onChange={(e) =>
                            handleItemChange(idx, "rate", e.target.value)
                          }
                          className="w-24 border-none text-center focus:ring-0 focus:outline-none"
                        />
                      </td>

                      {/* Amount */}
                      <td className="border px-3 py-1 text-center font-medium text-green-700">
                        {amount}
                      </td>

                      {/* Action */}
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
          <div className="flex justify-between items-center mt-6">
            <p className="text-gray-700">
              Issued By: <strong>{userName || "Fetching..."}</strong>
            </p>
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
