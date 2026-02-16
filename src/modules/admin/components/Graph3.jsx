import React from "react";

function Graph3() {
  const data = [
    { name: "Facebook", visitors: "1,480", percent: 60, color: "bg-red-500", light: "bg-red-100" },
    { name: "Facebook", visitors: "5,480", percent: 70, color: "bg-green-500", light: "bg-green-100" },
    { name: "Google", visitors: "4,807", percent: 80, color: "bg-purple-500", light: "bg-purple-100" },
    { name: "Instagram", visitors: "3,678", percent: 75, color: "bg-sky-500", light: "bg-sky-100" },
    { name: "Twitter", visitors: "2,645", percent: 30, color: "bg-emerald-500", light: "bg-orange-100" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-700 font-semibold text-sm">Social traffic</h2>
        <button className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded">
          SEE ALL
        </button>
      </div>

      {/* Table Header */}
      <div className="flex justify-between text-xs font-semibold text-gray-500 border-b pb-2 mb-2">
        <span>REFERRAL</span>
        <span>VISITORS</span>
      </div>

      {/* Data Rows */}
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between py-2">
          <div className="text-gray-800 text-sm w-1/4">{item.name}</div>
          <div className="text-gray-600 text-sm w-1/4 text-right">{item.visitors}</div>
          <div className="w-1/2 flex items-center gap-2">
            <span className="text-gray-600 text-xs">{item.percent}%</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-2 rounded-full ${item.color}`}
                style={{ width: `${item.percent}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Graph3;
