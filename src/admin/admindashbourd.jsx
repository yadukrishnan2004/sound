import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../Components/context/ApiContext";
import axios from "axios";








// Simple bar chart component for visualization
const MiniChart = ({ values, color }) => {
  
  return (
    <div className="flex items-end justify-between h-8 mt-2 space-x-1">
      {values.map((value, index) => (
        <div
          key={index}
          className={`w-2 ${color} rounded-t transition-all duration-300 hover:opacity-80`}
          style={{ height: `${value}%` }}
        ></div>
      ))}
    </div>
  );
};

const DashboardStats = () => {
  const [user,setUser]=useState([])
  const [loading,setLoading]=useState(false)

 useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/user/`);
        setUser(res.data);
        setIsBlocked(res.data.blocked || false);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);






  const now = new Date();
const year = now.getFullYear();      
const month = now.getMonth();    


  const newUsers = user.filter((u) => {
  const created = new Date(u.create);
  return (
    created.getFullYear() === year &&
    created.getMonth() === month
  );
});

const totalIncome = user.reduce((acc, user) => {
  if (user.myorder && user.myorder.length > 0) {
    const deliveredOrders = user.myorder.filter(order => order.status === "Delivered");
    const deliveredTotal = deliveredOrders.reduce((sum, order) => sum + order.total, 0);
    return acc + deliveredTotal;
  }
  return acc;
}, 0);

const pendingOrders = user.flatMap((u) =>
              (u.myorder || [])
                .filter((order) => order.status === "Pending")
                .map((order) => ({ ...order, userInfo: u }))
            );


  const stats = [
  {
    title: 'TOTAL USERS',
    value:` ${user.length}`,
    change: '↑ 24.5%',
    note: 'Since last month',
    color: 'from-blue-500 to-cyan-500',
    trend: 'text-green-400',
    icon: '🚀',
    chartColor: 'bg-blue-400',
  },
  {
    title: 'NEW USERS',
    value: `${newUsers.length}`,
    change: '↓ 3.5%',
    note: 'Since last week',
    color: 'from-purple-500 to-pink-500',
    trend: 'text-red-400',
    icon: '👥',
    chartColor: 'bg-purple-400',
  },
  {
    title: 'SALES',
    value: `${totalIncome}`,
    change: '↓ 11.0%',
    note: 'Since yesterday',
    color: 'from-rose-500 to-orange-500',
    trend: 'text-red-400',
    icon: '💰',
    chartColor: 'bg-rose-400',
  },
  {
    title: 'Pending Order',
    value: `${pendingOrders?.length||0}`,
    change: '↑ 12%',
    note: 'Since last month',
    color: 'from-emerald-500 to-teal-500',
    trend: 'text-green-400',
    icon: '⚡',
    chartColor: 'bg-emerald-400',
  },
];

if(loading){
  loading
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
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 w-64"
            />
            <span className="absolute right-3 top-2 text-gray-400">🔍</span>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg">
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}></div>
            
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 bg-black opacity-5"></div>
            
            {/* Content */}
            <div className="relative p-6 z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-white/80">{stat.title}</h2>
                  <p className="text-3xl font-bold mt-2 drop-shadow-lg">{stat.value}</p>
                </div>
                <div className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className={`text-sm font-semibold ${stat.trend} drop-shadow-sm`}>{stat.change}</p>
                  <p className="text-xs text-white/70 mt-1">{stat.note}</p>
                </div>
                <MiniChart 
                  values={[40, 60, 75, 55, 80, 65, 45]} 
                  color={stat.chartColor}
                />
              </div>
            </div>

            {/* Shine Effect on Hover */}
            <div className="absolute inset-0 -inset-x-24 bg-gradient-to-r from-white/10 via-white/5 to-white/10 transform rotate-12 scale-150 group-hover:translate-x-96 transition-all duration-1000"></div>
          </div>
        ))}
      </div>

      {/* Additional Visual Elements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold mb-4 text-cyan-400">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {['Generate Report', 'Export Data', 'Settings', 'Help Center'].map((action, idx) => (
              <button
                key={idx}
                className="p-3 bg-gray-700/50 rounded-xl hover:bg-gray-600/50 transition-all duration-200 text-sm text-left hover:transform hover:-translate-y-0.5"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-cyan-400">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'New user registration', time: '2 min ago', type: 'success' },
              { action: 'Sales target achieved', time: '1 hour ago', type: 'success' },
              { action: 'System backup completed', time: '3 hours ago', type: 'info' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-400' : 'bg-blue-400'
                }`}></div>
                <span className="flex-1 text-sm">{activity.action}</span>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;