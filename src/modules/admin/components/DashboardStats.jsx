import { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";
import { ENDPOINTS } from "../../../services/endpoints";

const MiniChart = ({ values, color }) => {
    return (
        <div className="flex items-end justify-between h-8 mt-2 space-x-1">
            {values.map((value, index) => (
                <div
                    key={index}
                    className={`w-2 ${color} rounded-t transition-all duration-300 hover:opacity-80`}
                    style={{ height: `${value}%` }}
                />
            ))}
        </div>
    );
};

const DashboardStats = () => {
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // ✅ Fetch users + orders together (cleaner + safer)
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                const [usersRes, ordersRes] = await Promise.all([
                    api.get(ENDPOINTS.ADMIN.USERS),
                    api.get(ENDPOINTS.ADMIN.ORDERS),
                ]);

                // USERS
                setUsers(usersRes.data?.data || []);

                // ORDERS (IMPORTANT: Items array)
                setOrders(ordersRes.data?.data?.Items || []);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const now = new Date();

    // ✅ NEW USERS THIS MONTH
    const newUsers = useMemo(() => {
        return users.filter((u) => {
            if (!u.created_at) return false;
            const created = new Date(u.created_at);

            return (
                created.getUTCFullYear() === now.getUTCFullYear() &&
                created.getUTCMonth() === now.getUTCMonth()
            );
        });
    }, [users]);

    // ✅ TOTAL SALES (status === complete)
    const totalIncome = useMemo(() => {
        return orders
            .filter((order) => order.status === "complete")
            .reduce((sum, order) => sum + (order.total || 0), 0);
    }, [orders]);

    // ✅ PENDING ORDERS
    const pendingOrders = useMemo(() => {
        return orders.filter((order) => order.status === "pending");
    }, [orders]);

    const stats = [
        {
            title: "TOTAL USERS",
            value: `${users.length}`,
            change: "↑ 24.5%",
            note: "Since last month",
            color: "from-blue-500 to-cyan-500",
            trend: "text-green-400",
            icon: "🚀",
            chartColor: "bg-blue-400",
        },
        {
            title: "NEW USERS",
            value: `${newUsers.length}`,
            change: "↓ 3.5%",
            note: "Since last week",
            color: "from-purple-500 to-pink-500",
            trend: "text-red-400",
            icon: "👥",
            chartColor: "bg-purple-400",
        },
        {
            title: "SALES",
            value: `${totalIncome}`,
            change: "↓ 11.0%",
            note: "Since yesterday",
            color: "from-rose-500 to-orange-500",
            trend: "text-red-400",
            icon: "💰",
            chartColor: "bg-rose-400",
        },
        {
            title: "Pending Order",
            value: `${pendingOrders.length}`,
            change: "↑ 12%",
            note: "Since last month",
            color: "from-emerald-500 to-teal-500",
            trend: "text-green-400",
            icon: "⚡",
            chartColor: "bg-emerald-400",
        },
    ];

    if (loading) {
        return <div className="p-6 text-white">Loading stats...</div>;
    }

    return (
        <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
                <div className="mb-4 lg:mb-0">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        📊 Analytics Dashboard
                    </h1>
                    <p className="text-gray-400 mt-2">Welcome to your business overview</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl"
                    >
                        <div
                            className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}
                        ></div>

                        <div className="relative p-6 z-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                                        {stat.title}
                                    </h2>
                                    <p className="text-3xl font-bold mt-2 drop-shadow-lg">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className="text-2xl">{stat.icon}</div>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <div>
                                    <p className={`text-sm font-semibold ${stat.trend}`}>
                                        {stat.change}
                                    </p>
                                    <p className="text-xs text-white/70 mt-1">
                                        {stat.note}
                                    </p>
                                </div>
                                <MiniChart
                                    values={[40, 60, 75, 55, 80, 65, 45]}
                                    color={stat.chartColor}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardStats;
