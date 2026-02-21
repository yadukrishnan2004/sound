import React, { useEffect, useState } from 'react';
import DashboardStats from '../components/DashboardStats';
import SalesChart from '../components/SalesChart';
import OrderStatusChart from '../components/OrderStatusChart';
import api from '../../../services/api';
import { ENDPOINTS } from '../../../services/endpoints';

function Dashboard() {
  const [graphData, setGraphData] = useState({ sales: [], orders: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGraphs = async () => {
      try {
        const response = await api.get(ENDPOINTS.ADMIN.DASHBOARD_GRAPHS);
        if (response.data && response.data.data) {
          setGraphData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard graphs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGraphs();
  }, []);

  return (
    <div className="p-6">
      <div className="h-full w-full overflow-hidden rounded-xl mb-6">
        <DashboardStats />
      </div>

      {loading ? (
        <div className="text-white text-center">Loading charts...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[400px]">
            <SalesChart data={graphData.sales || []} />
          </div>
          <div className="h-[400px]">
            <OrderStatusChart data={graphData.orders || []} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
