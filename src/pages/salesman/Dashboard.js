import React, { useState, useEffect, useCallback } from "react";
import { format, startOfWeek, endOfWeek } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Tab } from "@headlessui/react";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("today");
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Sample dashboard data
      const mockData = {
        salesmanInfo: {
          name: "Rahul Sharma",
          code: "SM001",
          avatar: "https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxQcm9maWxlJTJCcGhvdG8lMkJvZiUyQlJhaHVsJTJCU2hhcm1hfGVufDB8fHx8MTc0Nzk5MTU1Mnww&ixlib=rb-4.1.0&q=80&w=1080",
          territory: "Mumbai North",
          todayTarget: 25000,
          monthlyTarget: 500000,
          status: "on-route"
        },
        performance: {
          daily: {
            target: 25000,
            achieved: 18500,
            percentage: 74,
            orders: 12,
            retailers: 8
          },
          monthly: {
            target: 500000,
            achieved: 425000,
            percentage: 85,
            orders: 245,
            retailers: 85
          }
        },
        visits: {
          planned: 12,
          completed: 8,
          pending: 4,
          skipped: 0,
          nextVisit: {
            retailerName: "SuperMart Store",
            time: "14:30",
            address: "123 Main Street, Andheri East"
          }
        },
        collections: {
          total: 185000,
          pending: 45000,
          today: 15000
        },
        orders: {
          today: [
            {
              id: "ORD001",
              retailerName: "SuperMart Store",
              retailerImage: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxTdXBlck1hcnQlMkJzdG9yZSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkxOTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
              amount: 8500,
              status: "delivered",
              time: "10:30 AM"
            },
            {
              id: "ORD002",
              retailerName: "Quick Shop",
              retailerImage: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxRdWljayUyQlNob3AlMkJzdG9yZSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkyMjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
              amount: 6200,
              status: "processing",
              time: "11:45 AM"
            }
          ],
          weeklyTrend: [
            { day: "Mon", orders: 12, value: 25000 },
            { day: "Tue", orders: 15, value: 32000 },
            { day: "Wed", orders: 10, value: 18500 },
            { day: "Thu", orders: 14, value: 28000 },
            { day: "Fri", orders: 11, value: 22000 },
            { day: "Sat", orders: 8, value: 15000 },
            { day: "Sun", orders: 5, value: 9500 }
          ]
        },
        productPerformance: [
          { name: "Premium Cola 2L", target: 100, achieved: 85 },
          { name: "Fruit Juice 1L", target: 150, achieved: 120 },
          { name: "Snack Chips", target: 200, achieved: 180 },
          { name: "Energy Drink", target: 80, achieved: 95 }
        ],
        retailerCategories: [
          { name: "Supermarket", count: 15, value: 150000 },
          { name: "General Store", count: 25, value: 175000 },
          { name: "Convenience", count: 18, value: 85000 },
          { name: "Others", count: 12, value: 45000 }
        ]
      };

      setDashboardData(mockData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading || !dashboardData) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg p-6 h-32">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg p-6">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-100";
      case "processing":
        return "text-blue-600 bg-blue-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="space-y-6">
      {/* Salesman Info & Quick Stats */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12">
              {dashboardData.salesmanInfo.avatar ? (
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={dashboardData.salesmanInfo.avatar}
                  alt={dashboardData.salesmanInfo.name}
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><circle cx="80" cy="172" r="28" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="80" cy="60" r="28" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="176" cy="172" r="28" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="176" cy="60" r="28" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M32,224a60,60,0,0,1,96,0,60,60,0,0,1,96,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M32,112a60,60,0,0,1,96,0h0a60,60,0,0,1,96,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                </div>
              )}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-medium text-gray-900">
                {dashboardData.salesmanInfo.name}
              </h2>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500">
                  {dashboardData.salesmanInfo.code} • {dashboardData.salesmanInfo.territory}
                </span>
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="12" height="12"><rect width="256" height="256" fill="none"/><circle cx="92" cy="60" r="16"/><circle cx="164" cy="60" r="16"/><circle cx="92" cy="128" r="16"/><circle cx="164" cy="128" r="16"/><circle cx="92" cy="196" r="16"/><circle cx="164" cy="196" r="16"/></svg>
                  <span className="ml-1">On Route</span>
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setTimeRange("today")}
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  timeRange === "today"
                    ? "bg-primary-100 text-primary-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setTimeRange("week")}
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  timeRange === "week"
                    ? "bg-primary-100 text-primary-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                This Week
              </button>
              <button
                type="button"
                onClick={() => setTimeRange("month")}
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  timeRange === "month"
                    ? "bg-primary-100 text-primary-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                This Month
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full bg-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="128" y1="128" x2="224" y2="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M195.88,60.12A95.92,95.92,0,1,0,218,94.56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M161.94,94.06a48,48,0,1,0,13.11,43.46" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Target Achievement</p>
              <div className="flex items-center">
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData.performance.daily.percentage}%
                </p>
                <span className="ml-2 text-sm text-gray-500">
                  of ₹{dashboardData.performance.daily.target.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${Math.min(100, dashboardData.performance.daily.percentage)}%`
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><path d="M188,184H91.17a16,16,0,0,1-15.74-13.14L48.73,24H24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="92" cy="204" r="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="188" cy="204" r="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M70.55,144H196.1a16,16,0,0,0,15.74-13.14L224,64H56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Orders Today</p>
              <div className="flex items-center">
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData.performance.daily.orders}
                </p>
                <span className="ml-2 text-sm text-gray-500">orders</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Value: ₹{dashboardData.performance.daily.achieved.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full bg-purple-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="16" y1="216" x2="240" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="224 216 224 76 176 76 176 40 80 40 80 112 32 112 32 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="76" x2="136" y2="76" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="112" x2="136" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="112" x2="188" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="68" y1="148" x2="84" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="148" x2="136" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="148" x2="188" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M148,216V176a4,4,0,0,0-4-4H112a4,4,0,0,0-4,4v40Z"/></svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Visits</p>
              <div className="flex items-center">
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData.visits.completed}
                </p>
                <span className="ml-2 text-sm text-gray-500">
                  of {dashboardData.visits.planned}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <div className="text-green-600">
              {Math.round((dashboardData.visits.completed / dashboardData.visits.planned) * 100)}% completed
            </div>
            {dashboardData.visits.pending > 0 && (
              <div className="ml-4 text-yellow-600">
                {dashboardData.visits.pending} pending
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full bg-amber-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="128" y1="72" x2="128" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="168" x2="128" y2="184" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M104,168h36a20,20,0,0,0,0-40H116a20,20,0,0,1,0-40h36" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Collections</p>
              <div className="flex items-center">
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{dashboardData.collections.today.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-red-600">
            Pending: ₹{dashboardData.collections.pending.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white rounded-lg shadow">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-t-lg bg-gray-100 p-1">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                  selected
                    ? "bg-white shadow text-primary-700"
                    : "text-gray-700 hover:bg-white/[0.12] hover:text-gray-900"
                }`
              }
            >
              Orders & Sales
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                  selected
                    ? "bg-white shadow text-primary-700"
                    : "text-gray-700 hover:bg-white/[0.12] hover:text-gray-900"
                }`
              }
            >
              Visit Schedule
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                  selected
                    ? "bg-white shadow text-primary-700"
                    : "text-gray-700 hover:bg-white/[0.12] hover:text-gray-900"
                }`
              }
            >
              Product Performance
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                  selected
                    ? "bg-white shadow text-primary-700"
                    : "text-gray-700 hover:bg-white/[0.12] hover:text-gray-900"
                }`
              }
            >
              Retailer Analysis
            </Tab>
          </Tab.List>
          <Tab.Panels className="p-4">
            {/* Orders & Sales Panel */}
            <Tab.Panel>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Today's Orders */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Orders</h3>
                  <div className="space-y-4">
                    {dashboardData.orders.today.map((order) => (
                      <div
                        key={order.id}
                        className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {order.retailerImage ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={order.retailerImage}
                                alt={order.retailerName}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="16" y1="216" x2="240" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="224 216 224 76 176 76 176 40 80 40 80 112 32 112 32 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="76" x2="136" y2="76" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="112" x2="136" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="112" x2="188" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="68" y1="148" x2="84" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="148" x2="136" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="148" x2="188" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M148,216V176a4,4,0,0,0-4-4H112a4,4,0,0,0-4,4v40Z"/></svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              {order.retailerName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.time}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ₹{order.amount.toLocaleString()}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Sales Trend */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Sales Trend</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dashboardData.orders.weeklyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#3B82F6"
                          name="Sales Value"
                        />
                        <Line
                          type="monotone"
                          dataKey="orders"
                          stroke="#10B981"
                          name="Number of Orders"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Visit Schedule Panel */}
            <Tab.Panel>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Visit Progress */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Visit Progress</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Planned</p>
                        <p className="mt-1 text-2xl font-semibold text-gray-900">
                          {dashboardData.visits.planned}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Completed</p>
                        <p className="mt-1 text-2xl font-semibold text-green-600">
                          {dashboardData.visits.completed}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Pending</p>
                        <p className="mt-1 text-2xl font-semibold text-yellow-600">
                          {dashboardData.visits.pending}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Skipped</p>
                        <p className="mt-1 text-2xl font-semibold text-red-600">
                          {dashboardData.visits.skipped}
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full"
                        style={{
                          width: `${Math.round(
                            (dashboardData.visits.completed / dashboardData.visits.planned) * 100
                          )}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Next Visit */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Next Visit</h3>
                  {dashboardData.visits.nextVisit ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="16" y1="216" x2="240" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="224 216 224 76 176 76 176 40 80 40 80 112 32 112 32 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="76" x2="136" y2="76" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="112" x2="136" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="112" x2="188" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="68" y1="148" x2="84" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="148" x2="136" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="148" x2="188" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M148,216V176a4,4,0,0,0-4-4H112a4,4,0,0,0-4,4v40Z"/></svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {dashboardData.visits.nextVisit.retailerName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {dashboardData.visits.nextVisit.time}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="48" r="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="208" r="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                        <span className="ml-2">
                          {dashboardData.visits.nextVisit.address}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-500">No more visits scheduled for today</p>
                    </div>
                  )}
                </div>
              </div>
            </Tab.Panel>

            {/* Product Performance Panel */}
            <Tab.Panel>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Product Achievement */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Product Achievement</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dashboardData.productPerformance}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="target" fill="#93C5FD" name="Target" />
                        <Bar dataKey="achieved" fill="#3B82F6" name="Achieved" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Achievement Percentage */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Achievement Percentage</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dashboardData.productPerformance.map(product => ({
                          name: product.name,
                          percentage: Math.round((product.achieved / product.target) * 100)
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis unit="%" />
                        <Tooltip />
                        <Bar dataKey="percentage" name="Achievement">
                          {dashboardData.productPerformance.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={index % 2 === 0 ? "#3B82F6" : "#93C5FD"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Retailer Analysis Panel */}
            <Tab.Panel>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Retailer Categories */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Retailer Categories</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dashboardData.retailerCategories}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {dashboardData.retailerCategories.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Sales by Category */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Sales by Category</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboardData.retailerCategories}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" name="Sales Value">
                          {dashboardData.retailerCategories.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default Dashboard;