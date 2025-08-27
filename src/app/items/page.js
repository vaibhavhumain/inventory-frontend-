"use client";
import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import API from "../../../utils/api";
import SearchBar from "../../../components/SearchBar";
import AddItemForm from "../../../components/AddItemForm";
import { FiSearch } from "react-icons/fi";

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await API.get("/items");
        const sorted = [...res.data].sort((a, b) =>
          (a.category || "").localeCompare(b.category || "")
        );
        setItems(sorted);
        setFilteredItems(sorted);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  const handleSaveItem = async (newItem) => {
    try {
      const res = await API.post("/items", newItem);
      const saved = res.data;

      setItems((prev) => {
        const updated = [...prev];
        const categoryLower = (saved.category || "").toLowerCase().trim();

        const insertIndex = updated
          .map((it) => (it.category || "").toLowerCase().trim())
          .lastIndexOf(categoryLower);

        if (insertIndex !== -1) {
          updated.splice(insertIndex + 1, 0, saved);
        } else {
          updated.push(saved);
        }

        return updated;
      });

      setFilteredItems((prev) => {
        const updated = [...prev];
        const categoryLower = (saved.category || "").toLowerCase().trim();

        const insertIndex = updated
          .map((it) => (it.category || "").toLowerCase().trim())
          .lastIndexOf(categoryLower);

        if (insertIndex !== -1) {
          updated.splice(insertIndex + 1, 0, saved);
        } else {
          updated.push(saved);
        }

        return updated;
      });

      setShowForm(false);
    } catch (err) {
      console.error("Error creating item:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to create item");
    }
  };

  const handleSearch = (query) => {
    if (!query) {
      setFilteredItems(items);
      return;
    }
    const lower = query.toLowerCase();
    setFilteredItems(
      items.filter(
        (it) =>
          it.code?.toLowerCase().includes(lower) ||
          it.category?.toLowerCase().includes(lower) ||
          it.description?.toLowerCase().includes(lower) ||
          it.plantName?.toLowerCase().includes(lower)
      )
    );
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-[95%] mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-800 tracking-wide">
            📦 Inventory Items
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowSearch((prev) => !prev)}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              <FiSearch className="text-xl text-blue-700" />
            </button>

            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              ➕
            </button>
          </div>
        </div>

        {/* search bar */}
        {showSearch && (
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} />
          </div>
        )}

        {/* table */}
        {loading ? (
          <div className="flex justify-center items-center h-80">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 text-sm uppercase sticky top-0 z-10 shadow">
                <tr>
                  <th className="px-6 py-4 text-left">Sr No</th>
                  <th className="px-6 py-4 text-left">Code</th>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-left">Description</th>
                  <th className="px-6 py-4 text-left">Plant Name</th>
                  <th className="px-6 py-4 text-left">Weight</th>
                  <th className="px-6 py-4 text-left">Unit</th>
                  <th className="px-6 py-4 text-left">Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item, index) => (
                  <tr
                    key={item._id || index}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-3 font-semibold text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-3 font-semibold text-gray-900">
                      {item.code || "-"}
                    </td>
                    <td className="px-6 py-3 capitalize">{item.category}</td>
                    <td className="px-6 py-3 max-w-[300px] truncate">
                      {item.description}
                    </td>
                    <td className="px-6 py-3">{item.plantName || "-"}</td>
                    <td className="px-6 py-3">{item.weight || "-"}</td>
                    <td className="px-6 py-3">{item.unit || "-"}</td>
                    <td className="px-6 py-3">{item.closingQty || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* modal form */}
        {showForm && (
          <AddItemForm
            onClose={() => setShowForm(false)}
            onSave={handleSaveItem}
          />
        )}
      </div>
    </div>
  );
}
