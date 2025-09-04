import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

export default function AnalysisCharts({ title, type, data }) {
  return (
    <div className="bg-white shadow rounded p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        {type === "bar" ? (
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
