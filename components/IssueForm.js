"use client";
import { useEffect, useState } from "react";
import API from "../utils/api";
import Navbar from "./Navbar";

export default function IssueForm({ type }) {
  const [department, setDepartment] = useState("");
  const [issuedTo, setIssuedTo] = useState("");
  const [items, setItems] = useState([{ item: "", quantity: "", rate: "", amount: 0 }]);
  const [allItems, setAllItems] = useState([]);
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [chassisNumber, setChassisNumber] = useState("");
  const [engineNumber, setEngineNumber] = useState("");
  const [model, setModel] = useState("");
  const [remarks, setRemarks] = useState("");

  // Fetch items + summary
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [itemsRes, summaryRes] = await Promise.all([
          API.get("/items"),
          API.get("/stock/summary"),
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
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    fetchItems();
  }, []);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get("/auth/profile");
        setUserName(data.name);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  // Auto-clear messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle item field change
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    const qty = parseFloat(updated[index].quantity) || 0;
    const rate = parseFloat(updated[index].rate) || 0;
    updated[index].amount = qty * rate;

    setItems(updated);
  };

  const addItemRow = () =>
    setItems([...items, { item: "", quantity: "", rate: "", amount: 0 }]);

  const removeItemRow = (i) => setItems(items.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.some((it) => !it.item || !it.quantity)) {
      setMessage("❌ Please select an item and enter quantity.");
      return;
    }

    try {
      const payload = {
        issueDate: new Date(),
        department,
        type,
        issuedTo:
          type === "SUB_TO_USER" || type === "SUB_TO_SALE" ? issuedTo : undefined,
        items: items.map((it) => ({
          item: it.item,
          quantity: Number(it.quantity),
          rate: Number(it.rate) || 0,
          amount: it.amount,
        })),
      };

      if (type === "SUB_TO_USER") {
        payload.bus = { chassisNumber, engineNumber, model, remarks };
      }

      const { data } = await API.post("/issue-bills", payload);
      setMessage("✅ " + (data.message || "Issue Bill created successfully!"));

      setDepartment("");
      setIssuedTo("");
      setItems([{ item: "", quantity: "", rate: "", amount: 0 }]);
      setChassisNumber("");
      setEngineNumber("");
      setModel("");
      setRemarks("");
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.error || "Error creating issue bill"));
    }
  };

  // Total Amount
  const totalAmount = items.reduce(
    (sum, it) => sum + (parseFloat(it.amount) || 0),
    0
  );

  return (
    <div>
      <Navbar />
      <div className="max-w-full mx-auto mt-8 bg-white shadow-md p-6 rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {type === "MAIN_TO_SUB"
            ? "Issue Main → Sub"
            : type === "SUB_TO_USER"
            ? "Issue Sub → User"
            : "Issue Sub → Sale"}
        </h2>

        {/* Header Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
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

          <div>
            <label className="text-sm text-gray-600">Issued By</label>
            <input
              type="text"
              value={userName || ""}
              readOnly
              className="border p-2 rounded w-full bg-gray-100 text-gray-700"
            />
          </div>

          {(type === "SUB_TO_USER" || type === "SUB_TO_SALE") && (
            <div>
              <label className="text-sm text-gray-600">
                {type === "SUB_TO_USER" ? "Issued To (User)" : "Issued To (Customer)"}
              </label>
              <input
                type="text"
                value={issuedTo}
                onChange={(e) => setIssuedTo(e.target.value)}
                className="border p-2 rounded w-full"
                required
              />
            </div>
          )}

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

        {/* Bus Details (only for Sub → User) */}
        {type === "SUB_TO_USER" && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              placeholder="Chassis Number"
              value={chassisNumber}
              onChange={(e) => setChassisNumber(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Engine Number"
              value={engineNumber}
              onChange={(e) => setEngineNumber(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Bus Model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="border p-2 rounded col-span-2"
            />
            <input
              type="text"
              placeholder="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="border p-2 rounded col-span-2"
            />
          </div>
        )}

        {/* Table Section */}
        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr className="text-gray-700 font-semibold">
                  <th className="border px-3 py-2 text-center">#</th>
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

                  const available =
                    type === "MAIN_TO_SUB"
                      ? selected?.mainStoreQty
                      : type === "SUB_TO_USER" || type === "SUB_TO_SALE"
                      ? selected?.subStoreQty
                      : 0;

                  return (
                    <tr key={idx} className="text-gray-800">
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

                      <td className="border px-3 py-1 text-center text-green-700 font-medium">
                        {selected
                          ? `${available || 0} ${selected.unit || "pcs"}`
                          : "-"}
                      </td>

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
                          className="w-24 border-none text-center focus:ring-0 focus:outline-none"
                        />
                      </td>

                      <td className="border px-3 py-1 text-center font-medium text-green-700">
                        {amount}
                      </td>

                      <td className="border px-3 py-1 text-center">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItemRow(idx)}
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
              onClick={addItemRow}
              className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-sm"
            >
              ➕ Add Row
            </button>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-gray-700 font-semibold">
              Total: ₹{totalAmount.toFixed(2)}
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
