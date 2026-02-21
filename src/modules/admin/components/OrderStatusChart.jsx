import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const COLORS = {
    Pending: "#F59E0B",   // Amber
    Shipped: "#3B82F6",   // Blue
    Delivered: "#10B981", // Emerald
    Cancelled: "#EF4444", // Red
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const OrderStatusChart = ({ data }) => {
    return (
        <div className="bg-[#2E3A56] p-4 rounded-lg shadow-lg h-full">
            <h2 className="text-white text-sm font-bold uppercase mb-2">Performance</h2>
            <h1 className="text-white text-lg font-semibold mb-6">Order Status Distribution</h1>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="status"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.status] || "#9CA3AF"} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: "#1E273B", border: "none", color: "#fff" }}
                        itemStyle={{ color: "#fff" }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        wrapperStyle={{ color: "#fff" }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OrderStatusChart;
