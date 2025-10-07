"use client";
import { useEffect, useState } from "react";
import API from "../utils/api";
import Navbar from "./Navbar";

export default function IssueForm({ type }) {
  const [department, setDepartment] = useState("");
  const [issuedTo, setIssuedTo] = useState(""); // for SUB_TO_USER and SUB_TO_SALE
  const [items, setItems] = useState([{ item: "", quantity: "", rate: "" }]);
  const [allItems, setAllItems] = useState([]);
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState(""); // 🟢 auto-fetched user name

  // 🔹 Bus fields (only for SUB_TO_USER)
  const [chassisNumber, setChassisNumber] = useState("");
  const [engineNumber, setEngineNumber] = useState("");
  const [model, setModel] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await API.get("/items");
        setAllItems(data);

      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };
    fetchItems();
  }, []);

  // 🔹 Fetch current logged-in user (to show Issued By)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get("/auth/profile"); // backend should return logged-in user
        setUserName(data.name);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };
    fetchUser();
  }, []);

  // 🔹 Clear messages after 4s
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItemRow = () => {
    setItems([...items, { item: "", quantity: "", rate: "" }]);
  };

  const removeItemRow = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

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
          rate: it.rate ? Number(it.rate) : 0,
        })),
      };

      if (type === "SUB_TO_USER") {
        payload.bus = { chassisNumber, engineNumber, model, remarks };
      }

      const { data } = await API.post("/issue-bills", payload);

      setMessage("✅ " + (data.message || "Issue Bill created successfully!"));

      // Reset form
      setDepartment("");
      setIssuedTo("");
      setItems([{ item: "", quantity: "", rate: "" }]);
      setChassisNumber("");
      setEngineNumber("");
      setModel("");
      setRemarks("");
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.error || "Error creating issue bill"));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 border rounded-lg max-w-2xl mx-auto mt-8 bg-white shadow">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {type === "MAIN_TO_SUB"
            ? "Issue Main → Sub"
            : type === "SUB_TO_USER"
            ? "Issue Sub → User"
            : "Issue Sub → Sale"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="border p-2 rounded"
              required
            />

            {/* 🟢 Issued By - Auto-filled (non-editable) */}
            <div className="border p-2 rounded bg-gray-100 text-gray-700">
              <strong>{userName ? userName : "Fetching user..."}</strong>
            </div>

            {(type === "SUB_TO_USER" || type === "SUB_TO_SALE") && (
              <input
                type="text"
                placeholder={
                  type === "SUB_TO_USER"
                    ? "Issued To (User)"
                    : "Issued To (Customer)"
                }
                value={issuedTo}
                onChange={(e) => setIssuedTo(e.target.value)}
                className="border p-2 rounded"
                required
              />
            )}

            <input
              type="date"
              value={new Date().toISOString().split("T")[0]}
              className="border p-2 rounded bg-gray-100"
              disabled
            />
          </div>

          {/* 🔹 Bus Details Section */}
          {type === "SUB_TO_USER" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Items Section */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Items</h3>
            {items.map((it, index) => {
  const selectedItem = allItems.find((i) => i._id === it.item);

  return (
    <div
      key={index}
      className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 border-b pb-3"
    >
      <div>
        <select
          value={it.item}
          onChange={(e) => handleItemChange(index, "item", e.target.value)}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Select Item</option>
          {allItems.map((item) => (
            <option key={item._id} value={item._id}>
              {item.code} - {item.headDescription} - {item.mainStoreQty} in Main, {item.subStoreQty} in Sub 
            </option>
          ))}
        </select>

        {/* 🟢 Show available stock when item selected */}
        {selectedItem && (
  <p className="text-sm text-gray-600 mt-1">
    Available:&nbsp;
    <span className="font-medium text-green-600">
      {type === "MAIN_TO_SUB"
        ? selectedItem.mainStoreQty
        : type === "SUB_TO_USER"
        ? selectedItem.subStoreQty
        : selectedItem.closingQty}{" "}
      {selectedItem.unit || ""}
    </span>{" "}
    in stock
  </p>
)}

      </div>

      <input
        type="number"
        placeholder="Quantity"
        value={it.quantity}
        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
        className="border p-2 rounded"
        required
      />

      <input
        type="number"
        placeholder="Rate"
        value={it.rate}
        onChange={(e) => handleItemChange(index, "rate", e.target.value)}
        className="border p-2 rounded"
      />

      {items.length > 1 && (
        <button
          type="button"
          onClick={() => removeItemRow(index)}
          className="text-red-600 hover:underline text-sm md:col-span-3 text-left"
        >
          Remove
        </button>
      )}
    </div>
  );
})}

            <button
              type="button"
              onClick={addItemRow}
              className="mt-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            >
              ➕ Add Item
            </button>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Issue Bill
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center font-medium text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}
