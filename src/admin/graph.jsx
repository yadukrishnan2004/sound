import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "January", y2024: 40, y2025: 65 },
  { month: "February", y2024: 68, y2025: 78 },
  { month: "March", y2024: 85, y2025: 66 },
  { month: "April", y2024: 74, y2025: 44 },
  { month: "May", y2024: 55, y2025: 58 },
  { month: "June", y2024: 60, y2025: 70 },
  { month: "July", y2024: 87, y2025: 75 },
];

function Graph() {
  return (
    <div className="bg-[#2E3A56] p-4 rounded-lg shadow-lg">
      <h2 className="text-white text-sm font-bold uppercase mb-2">Overview</h2>
      <h1 className="text-white text-lg font-semibold mb-6">Sales value</h1>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#46536B" />
          <XAxis dataKey="month" stroke="#AAB3C0" />
          <YAxis stroke="#AAB3C0" domain={[40, 90]} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1E273B", border: "none" }}
            labelStyle={{ color: "#fff" }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ color: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="y2025"
            stroke="#5B5BF2"
            strokeWidth={3}
            dot={{ fill: "#5B5BF2" }}
            name="2025"
          />
          <Line
            type="monotone"
            dataKey="y2024"
            stroke="#FFFFFF"
            strokeWidth={3}
            dot={{ fill: "#FFFFFF" }}
            name="2024"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Graph
