import React, { useState, useEffect } from "react";
import { Tooltip } from "@headlessui/react";

const OrderStatusWidget = ({ data }) => {
  const [orderStats, setOrderStats] = useState({
    pending: 0,
    processing: 0,
    dispatched: 0,
    delivered: 0,
    cancelled: 0,
    total: 0
  });

  useEffect(() => {
    if (data) {
      setOrderStats(data);
    } else {
      // Sample data for demonstration
      setOrderStats({
        pending: 25,
        processing: 18,
        dispatched: 42,
        delivered: 156,
        cancelled: 8,
        total: 249
      });
    }
  }, [data]);

  const statusColors = {
    pending: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="128 72 128 128 184 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
    },
    processing: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><rect x="48" y="120" width="88" height="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M208,188v12a8,8,0,0,1-8,8H180" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="208" y1="116" x2="208" y2="140" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M184,48h16a8,8,0,0,1,8,8V72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="116" y1="48" x2="140" y2="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M48,76V56a8,8,0,0,1,8-8H68" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
    },
    dispatched: {
      bg: "bg-indigo-100",
      text: "text-indigo-800",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="220" cy="184" r="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="36" cy="184" r="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="84" cy="184" r="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="196" y1="184" x2="108" y2="184" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M156,184V56a8,8,0,0,1,8-8h0a48,48,0,0,1,48,48v8h0a32,32,0,0,1,32,32v48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M116,184V72H20a8,8,0,0,0-8,8V184" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
    },
    delivered: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><polyline points="88 136 112 160 168 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
    },
    cancelled: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><rect x="88" y="88" width="80" height="80" rx="12"/></svg>
    }
  };

  const calculatePercentage = (value) => {
    return orderStats.total > 0 ? Math.round((value / orderStats.total) * 100) : 0;
  };

  const StatusBar = ({ status, count }) => {
    const percentage = calculatePercentage(count);
    const colors = statusColors[status];

    return (
      <Tooltip>
        <Tooltip.Button className="w-full">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <span className={`${colors.bg} ${colors.text} p-1 rounded-md mr-2`}>
                  {colors.icon}
                </span>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {status}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900 mr-2">
                  {count}
                </span>
                <span className="text-xs text-gray-500">
                  ({percentage}%)
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${colors.bg} h-2 rounded-full transition-all duration-500 ease-in-out`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </Tooltip.Button>
        <Tooltip.Panel className="absolute z-10 bg-white p-2 text-sm rounded shadow-lg border">
          {count} orders {status}
        </Tooltip.Panel>
      </Tooltip>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Order Status</h3>
        <div className="flex items-center text-sm">
          <span className="text-gray-500 mr-2">Total Orders:</span>
          <span className="font-medium text-gray-900">{orderStats.total}</span>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(orderStats)
          .filter(([key]) => key !== "total")
          .map(([status, count]) => (
            <StatusBar
              key={status}
              status={status}
              count={count}
            />
          ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
          onClick={() => {/* Add view all orders action */}}
        >
          View All Orders
          <span className="ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><rect x="40" y="40" width="176" height="176" rx="8" transform="translate(256 0) rotate(90)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="144 96 96 96 96 144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="160" y1="160" x2="96" y2="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default OrderStatusWidget;