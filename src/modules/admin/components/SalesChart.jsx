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

const SalesChart = ({ data }) => {
    return (
        <div className="bg-[#2E3A56] p-4 rounded-lg shadow-lg h-full">
            <h2 className="text-white text-sm font-bold uppercase mb-2">Overview</h2>
            <h1 className="text-white text-lg font-semibold mb-6">Sales Value (Last 30 Days)</h1>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#46536B" />
                    <XAxis dataKey="date" stroke="#AAB3C0" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#AAB3C0" tick={{ fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#1E273B", border: "none", color: "#fff" }}
                        labelStyle={{ color: "#fff" }}
                    />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        wrapperStyle={{ color: "#fff" }}
                    />
                    <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#5B5BF2"
                        strokeWidth={3}
                        dot={{ fill: "#5B5BF2", r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Revenue"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesChart;
