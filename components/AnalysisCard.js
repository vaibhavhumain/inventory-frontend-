import React from "react";

export default function AnalysisCard({ title, value, icon, color = "blue" }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    red: "bg-red-100 text-red-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <div className="bg-white shadow rounded-2xl p-6 text-center hover:shadow-lg transition">
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${colors[color]} mb-3`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">{value ?? "Loading..."}</p>
    </div>
  );
}
