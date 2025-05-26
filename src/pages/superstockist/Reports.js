import React, { useState, useEffect, useCallback } from "react";
import ReportFilters from "../../components/reports/ReportFilters";
import { Tab } from "@headlessui/react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { format, subDays, parseISO } from "date-fns";
import toast from "react-hot-toast";

const Reports = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [reportType, setReportType] = useState("inventory");
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      endDate: new Date()
    },
    entity: "all",
    product: "all",
    location: "all"
  });

  const [summaryStats, setSummaryStats] = useState({
    totalStock: 0,
    stockValue: 0,
    totalDistributors: 0,
    activeDistributors: 0
  });

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D"
  ];

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setIsLoading(true);
    fetchReportData(reportType, newFilters);
  }, [reportType]);

  const fetchReportData = useCallback(async (type, currentFilters) => {
    setIsLoading(true);
    try {
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Sample data based on report type
      let mockData;
      if (type === "inventory") {
        mockData = {
          stockTrends: Array.from({ length: 30 }).map((_, index) => ({
            date: subDays(new Date(), 29 - index).toISOString(),
            totalStock: Math.floor(Math.random() * 5000) + 10000,
            stockValue: Math.floor(Math.random() * 1000000) + 2000000
          })),
          categoryBreakdown: [
            { name: "Beverages", value: 5000, stockValue: 250000 },
            { name: "Snacks", value: 4000, stockValue: 200000 },
            { name: "Groceries", value: 6000, stockValue: 300000 }
          ],
          locationBreakdown: [
            { name: "Main Warehouse", value: 8000, stockValue: 400000 },
            { name: "North Warehouse", value: 4000, stockValue: 200000 },
            { name: "South Warehouse", value: 3000, stockValue: 150000 }
          ],
          lowStockItems: [
            {
              id: "1",
              name: "Premium Cola 2L",
              sku: "COLA-2L-001",
              currentStock: 100,
              minStock: 500,
              location: "Main Warehouse",
              image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxDb2xhJTJCYm90dGxlJTJCcHJvZHVjdCUyQmltYWdlfGVufDB8fHx8MTc0Nzk4OTcyMHww&ixlib=rb-4.1.0&q=80&w=1080"
            }
          ]
        };
      } else {
        mockData = {
          distributorPerformance: [
            {
              id: "1",
              name: "Global Distribution Co.",
              logo: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxEaXN0cmlidXRpb24lMkJjb21wYW55JTJCbG9nb3xlbnwwfHx8fDE3NDc5ODkxMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
              orders: Array.from({ length: 30 }).map((_, index) => ({
                date: subDays(new Date(), 29 - index).toISOString(),
                value: Math.floor(Math.random() * 50000) + 30000,
                units: Math.floor(Math.random() * 100) + 50
              })),
              totalOrders: 156,
              totalValue: 1250000,
              growth: 12.5
            },
            {
              id: "2",
              name: "City Distributors Ltd.",
              logo: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxBbm90aGVyJTJCZGlzdHJpYnV0aW9uJTJCY29tcGFueSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkwNzI2fDA&ixlib=rb-4.1.0&q=80&w=1080",
              orders: Array.from({ length: 30 }).map((_, index) => ({
                date: subDays(new Date(), 29 - index).toISOString(),
                value: Math.floor(Math.random() * 40000) + 25000,
                units: Math.floor(Math.random() * 80) + 40
              })),
              totalOrders: 134,
              totalValue: 980000,
              growth: -5.2
            }
          ],
          regionPerformance: [
            { name: "North", value: 450000 },
            { name: "South", value: 380000 },
            { name: "East", value: 290000 },
            { name: "West", value: 320000 }
          ]
        };
      }

      setReportData(mockData);
      setSummaryStats({
        totalStock: type === "inventory" ? 
          mockData.stockTrends[mockData.stockTrends.length - 1].totalStock : 0,
        stockValue: type === "inventory" ? 
          mockData.stockTrends[mockData.stockTrends.length - 1].stockValue : 0,
        totalDistributors: type === "distributor" ? 
          mockData.distributorPerformance.length : 0,
        activeDistributors: type === "distributor" ? 
          mockData.distributorPerformance.filter(d => d.growth > 0).length : 0
      });
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast.error("Failed to load report data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReportData(reportType, filters);
  }, [fetchReportData, reportType, filters]);

  const exportReport = async (format) => {
    try {
      toast.loading(`Generating ${format.toUpperCase()} report...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.dismiss();
      toast.success(`Report exported as ${format.toUpperCase()} successfully!`);
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Failed to export report. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-96 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Reports & Analytics</h3>
            <p className="mt-1 text-sm text-gray-500">
              View detailed reports and analytics for inventory and distributor performance
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              type="button"
              onClick={() => exportReport("pdf")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="128" y1="144" x2="128" y2="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="216 144 216 208 40 208 40 144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="168 104 128 144 88 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              <span className="ml-2">Export PDF</span>
            </button>
            <button
              type="button"
              onClick={() => exportReport("excel")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><path d="M32,56H224a0,0,0,0,1,0,0V192a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V56A0,0,0,0,1,32,56Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="32" y1="104" x2="224" y2="104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="32" y1="152" x2="224" y2="152" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="88" y1="104" x2="88" y2="200" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              <span className="ml-2">Export Excel</span>
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><polyline points="32.7 76.92 128 129.08 223.3 76.92" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M131.84,25l88,48.18a8,8,0,0,1,4.16,7v95.64a8,8,0,0,1-4.16,7l-88,48.18a8,8,0,0,1-7.68,0l-88-48.18a8,8,0,0,1-4.16-7V80.18a8,8,0,0,1,4.16-7l88-48.18A8,8,0,0,1,131.84,25Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="129.09" x2="128" y2="232" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">Total Stock</p>
                <p className="text-2xl font-semibold text-blue-900">
                  {summaryStats.totalStock.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="128" y1="72" x2="128" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="168" x2="128" y2="184" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M104,168h36a20,20,0,0,0,0-40H116a20,20,0,0,1,0-40h36" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Stock Value</p>
                <p className="text-2xl font-semibold text-green-900">
                  ₹{summaryStats.stockValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="16" y1="216" x2="240" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="224 216 224 76 176 76 176 40 80 40 80 112 32 112 32 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="76" x2="136" y2="76" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="112" x2="136" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="112" x2="188" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="68" y1="148" x2="84" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="148" x2="136" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="148" x2="188" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M148,216V176a4,4,0,0,0-4-4H112a4,4,0,0,0-4,4v40Z"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-800">Total Distributors</p>
                <p className="text-2xl font-semibold text-purple-900">
                  {summaryStats.totalDistributors}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><polyline points="88 136 112 160 168 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-amber-800">Active Distributors</p>
                <p className="text-2xl font-semibold text-amber-900">
                  {summaryStats.activeDistributors}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white shadow rounded-lg p-4">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                  selected
                    ? "bg-white shadow text-primary-700"
                    : "text-gray-700 hover:bg-white/[0.12] hover:text-gray-900"
                }`
              }
              onClick={() => setReportType("inventory")}
            >
              Inventory Report
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                  selected
                    ? "bg-white shadow text-primary-700"
                    : "text-gray-700 hover:bg-white/[0.12] hover:text-gray-900"
                }`
              }
              onClick={() => setReportType("distributor")}
            >
              Distributor Performance
            </Tab>
          </Tab.List>

          <div className="mt-4">
            <ReportFilters
              onFiltersChange={handleFilterChange}
              initialFilters={filters}
              availableFilters={
                reportType === "inventory"
                  ? ["date", "product", "location"]
                  : ["date", "entity"]
              }
            />
          </div>

          <Tab.Panels className="mt-6">
            {/* Inventory Report Panel */}
            <Tab.Panel>
              {reportData && (
                <div className="space-y-6">
                  {/* Stock Trends Chart */}
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Stock Level Trends</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={reportData.stockTrends}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(date) => format(new Date(date), "MMM dd")}
                          />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip
                            formatter={(value, name) => [
                              name === "stockValue"
                                ? `₹${value.toLocaleString()}`
                                : value.toLocaleString(),
                              name === "stockValue" ? "Stock Value" : "Total Stock"
                            ]}
                            labelFormatter={(date) =>
                              format(new Date(date), "MMM dd, yyyy")
                            }
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="totalStock"
                            name="Total Stock"
                            stroke="#0088FE"
                            yAxisId="left"
                          />
                          <Line
                            type="monotone"
                            dataKey="stockValue"
                            name="Stock Value"
                            stroke="#00C49F"
                            yAxisId="right"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Category and Location Breakdown */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Category Distribution</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={reportData.categoryBreakdown}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label={({ name, percent }) =>
                                `${name} (${(percent * 100).toFixed(0)}%)`
                              }
                            >
                              {reportData.categoryBreakdown.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value) => `${value.toLocaleString()} units`}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Location Distribution</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={reportData.locationBreakdown}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                              formatter={(value, name) =>
                                name === "stockValue"
                                  ? `₹${value.toLocaleString()}`
                                  : `${value.toLocaleString()} units`
                              }
                            />
                            <Legend />
                            <Bar
                              dataKey="value"
                              name="Stock Units"
                              fill="#0088FE"
                            />
                            <Bar
                              dataKey="stockValue"
                              name="Stock Value"
                              fill="#00C49F"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Low Stock Alerts */}
                  {reportData.lowStockItems.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Low Stock Alerts</h3>
                      <div className="space-y-4">
                        {reportData.lowStockItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg"
                          >
                            <div className="flex-shrink-0 h-12 w-12">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-12 w-12 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><polyline points="32.7 76.92 128 129.08 223.3 76.92" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M131.84,25l88,48.18a8,8,0,0,1,4.16,7v95.64a8,8,0,0,1-4.16,7l-88,48.18a8,8,0,0,1-7.68,0l-88-48.18a8,8,0,0,1-4.16-7V80.18a8,8,0,0,1,4.16-7l88-48.18A8,8,0,0,1,131.84,25Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="129.09" x2="128" y2="232" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                SKU: {item.sku}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-red-600">
                                {item.currentStock} units
                              </p>
                              <p className="text-sm text-gray-500">
                                Min: {item.minStock}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Tab.Panel>

            {/* Distributor Performance Panel */}
            <Tab.Panel>
              {reportData && (
                <div className="space-y-6">
                  {/* Individual Distributor Performance */}
                  {reportData.distributorPerformance.map((distributor) => (
                    <div key={distributor.id} className="bg-white rounded-lg shadow p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {distributor.logo ? (
                              <img
                                src={distributor.logo}
                                alt={distributor.name}
                                className="h-12 w-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="16" y1="216" x2="240" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="224 216 224 76 176 76 176 40 80 40 80 112 32 112 32 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="76" x2="136" y2="76" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="112" x2="136" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="112" x2="188" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="68" y1="148" x2="84" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="148" x2="136" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="148" x2="188" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M148,216V176a4,4,0,0,0-4-4H112a4,4,0,0,0-4,4v40Z"/></svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">
                              {distributor.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {distributor.totalOrders} orders • ₹{distributor.totalValue.toLocaleString()} total value
                            </p>
                          </div>
                        </div>
                        <div className={`text-sm font-medium ${
                          distributor.growth >= 0 ? "text-green-600" : "text-red-600"
                        }`}>
                          {distributor.growth >= 0 ? "+" : ""}{distributor.growth}% growth
                        </div>
                      </div>

                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={distributor.orders}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="date"
                              tickFormatter={(date) => format(new Date(date), "MMM dd")}
                            />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip
                              formatter={(value, name) => [
                                name === "value"
                                  ? `₹${value.toLocaleString()}`
                                  : value.toLocaleString(),
                                name === "value" ? "Order Value" : "Units Sold"
                              ]}
                              labelFormatter={(date) =>
                                format(new Date(date), "MMM dd, yyyy")
                              }
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="value"
                              name="Order Value"
                              stroke="#0088FE"
                              yAxisId="left"
                            />
                            <Line
                              type="monotone"
                              dataKey="units"
                              name="Units Sold"
                              stroke="#00C49F"
                              yAxisId="right"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ))}

                  {/* Regional Performance */}
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Regional Performance</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={reportData.regionPerformance}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label={({ name, percent }) =>
                                `${name} (${(percent * 100).toFixed(0)}%)`
                              }
                            >
                              {reportData.regionPerformance.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value) => `₹${value.toLocaleString()}`}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-4">
                        {reportData.regionPerformance.map((region, index) => (
                          <div
                            key={region.name}
                            className="bg-gray-50 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {region.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ₹{region.value.toLocaleString()}
                                </p>
                              </div>
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default Reports;