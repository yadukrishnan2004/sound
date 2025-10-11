import React from 'react'
import DashboardStats from './admindashbourd'
import Graph from './graph'
import Graph2 from './graph2'
import Graph3 from './graph3'

function Homee() {
  return (
    <div>
         <div className="h-80 w-full overflow-hidden rounded-xl">
          <DashboardStats />
        </div>

        <div className="flex">
          <div className="w-[50%] h-[30%] py-6">
            <Graph />
          </div>
          <div className="w-[48%] h-[30%] px-5 py-5">
            <Graph2 />
          </div>
        </div>

        <div className="w-full h-[30%]">
          <div className="w-[50%]">
            <Graph3 />
          </div>
        </div>
      
    </div>
  )
}

export default Homee
