import React, { useState, useEffect } from "react";
import { Tooltip } from "@headlessui/react";

const InventorySummary = ({ data }) => {
  const [inventoryData, setInventoryData] = useState({
    totalValue: 0,
    totalItems: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    recentUpdates: [],
    categories: []
  });

  useEffect(() => {
    if (data) {
      setInventoryData(data);
    } else {
      // Sample data for demonstration
      setInventoryData({
        totalValue: 2450000,
        totalItems: 156,
        lowStockItems: 12,
        outOfStockItems: 3,
        recentUpdates: [
          {
            id: 1,
            productName: "Product A",
            stockLevel: 25,
            threshold: 30,
            status: "low"
          },
          {
            id: 2,
            productName: "Product B",
            stockLevel: 0,
            threshold: 20,
            status: "out"
          },
          {
            id: 3,
            productName: "Product C",
            stockLevel: 15,
            threshold: 25,
            status: "low"
          }
        ],
        categories: [
          { name: "Category A", value: 35, percentage: 35 },
          { name: "Category B", value: 28, percentage: 28 },
          { name: "Category C", value: 22, percentage: 22 },
          { name: "Category D", value: 15, percentage: 15 }
        ]
      });
    }
  }, [data]);

  const getStatusColor = (status) => {
    switch (status) {
      case "low":
        return {
          bg: "bg-amber-100",
          text: "text-amber-800",
          icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><path d="M142.41,40.22l87.46,151.87C236,202.79,228.08,216,215.46,216H40.54C27.92,216,20,202.79,26.13,192.09L113.59,40.22C119.89,29.26,136.11,29.26,142.41,40.22Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="136" x2="128" y2="104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="176" r="16"/></svg>
        };
      case "out":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><line x1="160" y1="96" x2="96" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="96" y1="96" x2="160" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
        };
      default:
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><polyline points="88 136 112 160 168 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
        };
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Inventory Summary</h3>
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          View All
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-primary-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-primary-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><polyline points="32.7 76.92 128 129.08 223.3 76.92" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M131.84,25l88,48.18a8,8,0,0,1,4.16,7v95.64a8,8,0,0,1-4.16,7l-88,48.18a8,8,0,0,1-7.68,0l-88-48.18a8,8,0,0,1-4.16-7V80.18a8,8,0,0,1,4.16-7l88-48.18A8,8,0,0,1,131.84,25Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="129.09" x2="128" y2="232" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-primary-900">Total Items</p>
              <p className="text-xl font-semibold text-primary-700">
                {inventoryData.totalItems}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="56" y1="128" x2="136" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M184,208H60a36,36,0,0,0,36-36V84a44,44,0,0,1,72-33.95" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-900">Total Value</p>
              <p className="text-xl font-semibold text-green-700">
                {formatCurrency(inventoryData.totalValue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-amber-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><path d="M142.41,40.22l87.46,151.87C236,202.79,228.08,216,215.46,216H40.54C27.92,216,20,202.79,26.13,192.09L113.59,40.22C119.89,29.26,136.11,29.26,142.41,40.22Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="136" x2="128" y2="104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="176" r="16"/></svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-amber-900">Low Stock</p>
              <p className="text-xl font-semibold text-amber-700">
                {inventoryData.lowStockItems}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="160" y1="96" x2="96" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="96" y1="96" x2="160" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-900">Out of Stock</p>
              <p className="text-xl font-semibold text-red-700">
                {inventoryData.outOfStockItems}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Category Distribution
        </h4>
        <div className="space-y-3">
          {inventoryData.categories.map((category) => (
            <div key={category.name}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{category.name}</span>
                <span className="text-gray-900 font-medium">{category.value}%</span>
              </div>
              <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Updates */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Stock Alerts
        </h4>
        <div className="space-y-3">
          {inventoryData.recentUpdates.map((item) => {
            const status = getStatusColor(item.status);
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
              >
                <div className="flex items-center">
                  <div className={`${status.bg} p-2 rounded-md mr-3`}>
                    <span className={status.text}>{status.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.productName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Stock Level: {item.stockLevel} / {item.threshold}
                    </p>
                  </div>
                </div>
                <Tooltip>
                  <Tooltip.Button className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="32" x2="128" y2="224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="176" y1="44.84" x2="176" y2="211.16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  </Tooltip.Button>
                  <Tooltip.Panel className="bg-white p-2 text-xs rounded shadow-lg border">
                    {item.status === "low" ? "Low stock alert" : "Out of stock alert"}
                  </Tooltip.Panel>
                </Tooltip>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Action */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center">
          View Detailed Inventory Report
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><rect x="40" y="40" width="176" height="176" rx="8" transform="translate(256 0) rotate(90)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="144 96 96 96 96 144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="160" y1="160" x2="96" y2="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
        </button>
      </div>
    </div>
  );
};

export default InventorySummary;