"use client";
import { useState } from "react";
import API from "../utils/api"; 
import { toast } from "react-toastify";

export default function FeedForm() {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/stock/feed", { itemName, quantity });
      toast.success(data.message || "Stock feed successfully! ✅");
      setItemName("");
      setQuantity("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error feeding stock ❌");
    }
  };

  return (
    <div className="p-6 border rounded-lg max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Feed Stock</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
