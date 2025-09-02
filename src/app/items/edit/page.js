"use client";
import { useEffect, useState } from "react";
import Navbar from "../../../../components/Navbar";
import API from "../../../../utils/api";
import SearchBar from "../../../../components/SearchBar";

export default function EditItemsPage() {
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch items from API
  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await API.get("/items");
        console.log("Fetched items:", res.data); // 🔍 Debug
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    }
    fetchItems();
  }, []);

  // Handle search
  const handleSearch = (query) => {
    if (!query) {
      setFilteredItems([]);
      return;
    }
    const lower = query.toLowerCase();

    // 🔑 More flexible: check all string values in object
    const results = items.filter((it) =>
      Object.values(it).some(
        (val) =>
          typeof val === "string" && val.toLowerCase().includes(lower)
      )
    );

    setFilteredItems(results);
  };

  // Add to selected list
  const handleAddItem = (item) => {
    if (!selectedItems.find((s) => s._id === item._id)) {
      setSelectedItems((prev) => [...prev, { ...item, newQty: item.closingQty }]);
    }
  };

  // Save changes
  const handleSave = async () => {
    if (selectedItems.length === 0) {
      alert("No items selected to update!");
      return;
    }

    const payload = {
      date,
      changes: selectedItems.map((item) => ({
        itemId: item._id,
        newQty: item.newQty,
      })),
    };

    try {
      setSaving(true);
      const res = await API.post("/items/bulk-update", payload);
      alert(`✅ ${res.data.count} items updated successfully`);

      const updated = items.map((it) => {
        const updatedItem = res.data.items.find((u) => u._id === it._id);
        return updatedItem ? updatedItem : it;
      });
      setItems(updated);

      setSelectedItems([]);
      setShowSearch(false); // close search after saving
    } catch (err) {
      console.error("Save error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-[95%] mx-auto px-4 py-8">
        {/* Date Picker */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Date of Changes
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
        </div>

        {/* Selected Items Table */}
        <h4 className="text-xl font-bold mb-4">📋 Selected Items</h4>
        <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-gray-200 mb-4">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-green-100 text-green-800 uppercase text-xs">
              <tr>
                <th className="px-4 py-2 text-left">Code</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Old Qty</th>
                <th className="px-4 py-2 text-left">New Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {selectedItems.map((item) => (
                <tr key={item._id}>
                  <td className="px-4 py-2">{item.code}</td>
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="px-4 py-2">{item.closingQty}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={item.newQty}
                      onChange={(e) => {
                        const newQty = Number(e.target.value);
                        setSelectedItems((prev) =>
                          prev.map((s) =>
                            s._id === item._id ? { ...s, newQty } : s
                          )
                        );
                      }}
                      className="border rounded px-2 py-1 w-24"
                    />
                  </td>
                </tr>
              ))}
              {selectedItems.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No items selected yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add button */}
        <div className="mb-6">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showSearch ? "Close Search" : "+ Add Item"}
          </button>
        </div>

        {/* Search Section */}
        {showSearch && (
          <div className="mb-8">
            <SearchBar
              onSearch={handleSearch}
              placeholder="🔍 Search items..."
            />
            <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-gray-200 mt-4">
              <table className="w-full text-sm text-gray-700">
                <thead className="bg-blue-100 text-blue-800 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-2 text-left">Code</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Qty</th>
                    <th className="px-4 py-2 text-left"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item._id}>
                      <td className="px-4 py-2">{item.code}</td>
                      <td className="px-4 py-2">{item.description}</td>
                      <td className="px-4 py-2">{item.category}</td>
                      <td className="px-4 py-2">{item.closingQty}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleAddItem(item)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500">
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-2 rounded-lg text-white ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {saving ? "Saving..." : "💾 Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
