import React from 'react';
import DashboardStats from '../components/DashboardStats';
// Assuming we move graphs or reuse them. 
// For now, let's comment them out or import if I move them.
// import Graph from '../components/Graph';
// import Graph2 from '../components/Graph2';
// import Graph3 from '../components/Graph3';

function Dashboard() {
    return (
        <div>
            <div className="h-full w-full overflow-hidden rounded-xl">
                <DashboardStats />
            </div>

            {/* Graphs Section - Temporarily commented out until migrated
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <div className="md:w-1/2 h-[300px]">
            <Graph />
          </div>
          <div className="md:w-1/2 h-[300px]">
            <Graph2 />
          </div>
        </div>

        <div className="w-full mt-6 h-[300px]">
          <div className="md:w-1/2">
            <Graph3 />
          </div>
        </div>
        */}
        </div>
    )
}

export default Dashboard;
