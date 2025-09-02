"use client";
import { useState, useEffect } from "react";

export default function SearchBar({ onSearch, placeholder = "Search..." }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery("");     
    onSearch("");     
  };

  // Auto search with debounce (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
    // only depend on query to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="mb-6 flex justify-center gap-2">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />
      <button
        onClick={handleClear}
        className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
      >
        Clear
      </button>
    </div>
  );
}
