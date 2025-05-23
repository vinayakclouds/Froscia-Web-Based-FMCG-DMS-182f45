import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesOverview = ({ data }) => {
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    monthlyGrowth: 0,
    averageOrderValue: 0,
    topProducts: [],
    salesTrend: [],
    categoryBreakdown: []
  });

  const [timeframe, setTimeframe] = useState("month"); // month, quarter, year
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (data) {
      setMetrics(data);
      setIsLoading(false);
    } else {
      // Sample data for demonstration
      setMetrics({
        totalSales: 2450000,
        monthlyGrowth: 12.5,
        averageOrderValue: 15000,
        topProducts: [
          { name: "Product A", sales: 450000 },
          { name: "Product B", sales: 380000 },
          { name: "Product C", sales: 320000 },
          { name: "Product D", sales: 280000 }
        ],
        salesTrend: [
          { month: "Jan", value: 180000 },
          { month: "Feb", value: 220000 },
          { month: "Mar", value: 240000 },
          { month: "Apr", value: 280000 },
          { month: "May", value: 260000 },
          { month: "Jun", value: 300000 }
        ],
        categoryBreakdown: [
          { category: "Category A", percentage: 35 },
          { category: "Category B", percentage: 28 },
          { category: "Category C", percentage: 22 },
          { category: "Category D", percentage: 15 }
        ]
      });
      setIsLoading(false);
    }
  }, [data]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  const salesTrendData = {
    labels: metrics.salesTrend.map(item => item.month),
    datasets: [
      {
        label: "Monthly Sales",
        data: metrics.salesTrend.map(item => item.value),
        fill: false,
        borderColor: "rgb(99, 102, 241)",
        tension: 0.4
      }
    ]
  };

  const categoryData = {
    labels: metrics.categoryBreakdown.map(item => item.category),
    datasets: [
      {
        label: "Category Distribution",
        data: metrics.categoryBreakdown.map(item => item.percentage),
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(147, 51, 234, 0.8)"
        ]
      }
    ]
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Sales Overview</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeframe("month")}
            className={`px-3 py-1 text-sm rounded-md ${
              timeframe === "month"
                ? "bg-primary-100 text-primary-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeframe("quarter")}
            className={`px-3 py-1 text-sm rounded-md ${
              timeframe === "quarter"
                ? "bg-primary-100 text-primary-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Quarter
          </button>
          <button
            onClick={() => setTimeframe("year")}
            className={`px-3 py-1 text-sm rounded-md ${
              timeframe === "year"
                ? "bg-primary-100 text-primary-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="128" y1="72" x2="128" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="168" x2="128" y2="184" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M104,168h36a20,20,0,0,0,0-40H116a20,20,0,0,1,0-40h36" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Sales</p>
              <h4 className="text-xl font-semibold text-gray-900">
                {formatCurrency(metrics.totalSales)}
              </h4>
              <p className={`text-sm ${metrics.monthlyGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
                <span className="flex items-center">
                  {metrics.monthlyGrowth >= 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><line x1="64" y1="192" x2="192" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="88 64 192 64 192 168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><rect x="40" y="40" width="176" height="176" rx="8" transform="translate(256 0) rotate(90)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="160" y1="160" x2="96" y2="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="160 112 160 160 112 160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  )}
                  {Math.abs(metrics.monthlyGrowth)}% from last month
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><path d="M188,184H91.17a16,16,0,0,1-15.74-13.14L48.73,24H24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="92" cy="204" r="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="188" cy="204" r="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M70.55,144H196.1a16,16,0,0,0,15.74-13.14L224,64H56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Order Value</p>
              <h4 className="text-xl font-semibold text-gray-900">
                {formatCurrency(metrics.averageOrderValue)}
              </h4>
              <p className="text-sm text-gray-600">Per transaction</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="48" y1="216" x2="48" y2="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="48 56 176 56 176 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="48 104 224 104 224 152 48 152" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="144 152 144 200 48 200" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Top Product</p>
              <h4 className="text-xl font-semibold text-gray-900">
                {metrics.topProducts[0]?.name}
              </h4>
              <p className="text-sm text-gray-600">
                {formatCurrency(metrics.topProducts[0]?.sales)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Sales Trend</h4>
        <div className="h-64">
          <Line
            data={salesTrendData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => formatCurrency(value)
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Category Distribution</h4>
          <div className="h-48">
            <Bar
              data={categoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `${value}%`
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Top Products</h4>
          <div className="space-y-4">
            {metrics.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    index === 0 ? "bg-yellow-100 text-yellow-600" :
                    index === 1 ? "bg-gray-100 text-gray-600" :
                    index === 2 ? "bg-orange-100 text-orange-600" :
                    "bg-gray-50 text-gray-500"
                  }`}>
                    {index + 1}
                  </span>
                  <span className="ml-3 text-sm text-gray-900">{product.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(product.sales)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><line x1="128" y1="144" x2="128" y2="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="216 144 216 208 40 208 40 144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="168 104 128 144 88 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
          <span className="ml-2">Download Report</span>
        </button>
      </div>
    </div>
  );
};

export default SalesOverview;