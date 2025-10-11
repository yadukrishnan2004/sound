import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "January", y2024: 25, y2025: 35 },
  { month: "February", y2024: 70, y2025: 78 },
  { month: "March", y2024: 85, y2025: 60 },
  { month: "April", y2024: 75, y2025: 40 },
  { month: "May", y2024: 10, y2025: 100 },
  { month: "June", y2024: 5, y2025: 50 },
  { month: "July", y2024: 87, y2025: 15 },
];

function Graph2() {
  return (
    <div className="bg-[#E9F2FB] p-4 rounded-lg shadow-lg">
      <h2 className="text-gray-600 text-sm font-bold uppercase mb-1">Performance</h2>
      <h1 className="text-gray-800 text-lg font-semibold mb-6">Total orders</h1>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="month" stroke="#555" />
            <YAxis stroke="#555" />
            <Tooltip
              contentStyle={{ backgroundColor: "#f8f9fa", border: "none" }}
              labelStyle={{ color: "#000" }}
            />
            <Legend />
            <Bar dataKey="y2025" fill="#F26BAA" barSize={25} name="2025" radius={[5, 5, 0, 0]} />
            <Bar dataKey="y2024" fill="#5B5BF2" barSize={25} name="2024" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Graph2;
