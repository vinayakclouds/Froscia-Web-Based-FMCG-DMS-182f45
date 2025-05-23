import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  AreaChart,
  Area,
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
import { format, parseISO, subDays } from "date-fns";
import { Tab } from "@headlessui/react";
import toast from "react-hot-toast";

const SalesPerformanceReport = ({
  dateRange,
  compareMode = false,
  comparisonDateRange = null,
  filters = {},
  onDataLoad
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [viewType, setViewType] = useState("daily");
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topProducts: [],
    topSalesmen: [],
    topRegions: []
  });

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#A4DE6C",
    "#D0ED57"
  ];

  // Fetch report data
  const fetchReportData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Sample data
      const generateData = (startDate, days) => {
        return Array.from({ length: days }).map((_, index) => {
          const date = subDays(new Date(startDate), index);
          return {
            date: date.toISOString(),
            revenue: Math.floor(Math.random() * 100000) + 50000,
            orders: Math.floor(Math.random() * 100) + 50,
            averageOrderValue: Math.floor(Math.random() * 2000) + 1000,
            units: Math.floor(Math.random() * 500) + 200
          };
        }).reverse();
      };

      const mockSalesData = generateData(dateRange.endDate, 30);
      setSalesData(mockSalesData);

      if (compareMode && comparisonDateRange) {
        const mockComparisonData = generateData(comparisonDateRange.endDate, 30);
        setComparisonData(mockComparisonData);
      }

      // Sample summary data
      const mockSummary = {
        totalRevenue: mockSalesData.reduce((sum, day) => sum + day.revenue, 0),
        totalOrders: mockSalesData.reduce((sum, day) => sum + day.orders, 0),
        averageOrderValue: Math.floor(
          mockSalesData.reduce((sum, day) => sum + day.averageOrderValue, 0) / mockSalesData.length
        ),
        topProducts: [
          {
            id: "1",
            name: "Premium Cola 2L",
            revenue: 250000,
            units: 5000,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxDb2xhJTJCYm90dGxlJTJCcHJvZHVjdCUyQmltYWdlfGVufDB8fHx8MTc0Nzk4OTcyMHww&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            id: "2",
            name: "Fruit Juice Mango 1L",
            revenue: 180000,
            units: 3600,
            image: "https://images.unsplash.com/photo-1601924287811-e34de5d17476?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxNYW5nbyUyQmp1aWNlJTJCcGFja2V0JTJCaW1hZ2V8ZW58MHx8fHwxNzQ3OTg5NzIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
          }
        ],
        topSalesmen: [
          {
            id: "1",
            name: "John Smith",
            revenue: 450000,
            orders: 300,
            avatar: "https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxTYWxlc3BlcnNvbiUyQnByb2ZpbGUlMkJwaG90b3xlbnwwfHx8fDE3NDc5OTAyMTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            id: "2",
            name: "Sarah Johnson",
            revenue: 380000,
            orders: 250,
            avatar: "https://images.unsplash.com/photo-1445633883498-7f9922d37a3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxGZW1hbGUlMkJzYWxlc3BlcnNvbiUyQnByb2ZpbGUlMkJwaG90b3xlbnwwfHx8fDE3NDc5OTAyOTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
          }
        ],
        topRegions: [
          { name: "North", value: 350000 },
          { name: "South", value: 280000 },
          { name: "East", value: 220000 },
          { name: "West", value: 190000 }
        ]
      };

      setSummary(mockSummary);
      if (onDataLoad) {
        onDataLoad(mockSummary);
      }

    } catch (error) {
      console.error("Error fetching report data:", error);
      toast.error("Failed to load report data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, compareMode, comparisonDateRange, onDataLoad]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const metrics = useMemo(() => ({
    revenue: {
      label: "Revenue",
      formatter: (value) => `₹${value.toLocaleString()}`,
      color: "#0088FE"
    },
    orders: {
      label: "Orders",
      formatter: (value) => value.toLocaleString(),
      color: "#00C49F"
    },
    averageOrderValue: {
      label: "Average Order Value",
      formatter: (value) => `₹${value.toLocaleString()}`,
      color: "#FFBB28"
    },
    units: {
      label: "Units Sold",
      formatter: (value) => value.toLocaleString(),
      color: "#FF8042"
    }
  }), []);

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    switch (viewType) {
      case "daily":
        return format(date, "MMM dd");
      case "weekly":
        return `Week ${format(date, "w")}`;
      case "monthly":
        return format(date, "MMM yyyy");
      default:
        return format(date, "MMM dd");
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-96 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metric Selection and View Type */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
          >
            {Object.entries(metrics).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className="h-3 w-3 bg-primary-500 rounded-full"></span>
            <span>Current Period</span>
          </div>
          {compareMode && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="h-3 w-3 bg-gray-400 rounded-full"></span>
              <span>Previous Period</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={salesData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={metrics[selectedMetric].formatter}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => metrics[selectedMetric].formatter(value)}
                labelFormatter={(label) => formatDate(label)}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                name={metrics[selectedMetric].label}
                stroke={metrics[selectedMetric].color}
                fill={metrics[selectedMetric].color}
                fillOpacity={0.3}
              />
              {compareMode && (
                <Area
                  type="monotone"
                  data={comparisonData}
                  dataKey={selectedMetric}
                  name={`Previous ${metrics[selectedMetric].label}`}
                  stroke="#9CA3AF"
                  fill="#9CA3AF"
                  fillOpacity={0.3}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="128" y1="72" x2="128" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="168" x2="128" y2="184" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M104,168h36a20,20,0,0,0,0-40H116a20,20,0,0,1,0-40h36" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                ₹{summary.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-green-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><path d="M188,184H91.17a16,16,0,0,1-15.74-13.14L48.73,24H24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="92" cy="204" r="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="188" cy="204" r="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M70.55,144H196.1a16,16,0,0,0,15.74-13.14L224,64H56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">
                {summary.totalOrders.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-yellow-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><rect x="32" y="48" width="192" height="160" rx="8" transform="translate(256) rotate(90)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="92" y1="76" x2="164" y2="76" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="104" cy="128" r="16"/><circle cx="152" cy="128" r="16"/><circle cx="104" cy="176" r="16"/><circle cx="152" cy="176" r="16"/></svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average Order Value</p>
              <p className="text-2xl font-semibold text-gray-900">
                ₹{summary.averageOrderValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-purple-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><polyline points="224 208 32 208 32 48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="224 96 160 152 96 104 32 160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Growth Rate</p>
              <p className="text-2xl font-semibold text-green-600">+12.5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Tabs */}
      <div className="bg-white rounded-lg shadow">
        <Tab.Group>
          <Tab.List className="flex border-b border-gray-200">
            <Tab
              className={({ selected }) =>
                `flex-1 py-4 px-1 text-center text-sm font-medium focus:outline-none ${
                  selected
                    ? "text-primary-600 border-b-2 border-primary-500"
                    : "text-gray-500 hover:text-gray-700"
                }`
              }
            >
              Top Products
            </Tab>
            <Tab
              className={({ selected }) =>
                `flex-1 py-4 px-1 text-center text-sm font-medium focus:outline-none ${
                  selected
                    ? "text-primary-600 border-b-2 border-primary-500"
                    : "text-gray-500 hover:text-gray-700"
                }`
              }
            >
              Top Salesmen
            </Tab>
            <Tab
              className={({ selected }) =>
                `flex-1 py-4 px-1 text-center text-sm font-medium focus:outline-none ${
                  selected
                    ? "text-primary-600 border-b-2 border-primary-500"
                    : "text-gray-500 hover:text-gray-700"
                }`
              }
            >
              Regional Performance
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel className="p-4">
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  {summary.topProducts.map((product, index) => (
                    <li key={product.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-12 w-12">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><polyline points="32.7 76.92 128 129.08 223.3 76.92" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M131.84,25l88,48.18a8,8,0,0,1,4.16,7v95.64a8,8,0,0,1-4.16,7l-88,48.18a8,8,0,0,1-7.68,0l-88-48.18a8,8,0,0,1-4.16-7V80.18a8,8,0,0,1,4.16-7l88-48.18A8,8,0,0,1,131.84,25Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="129.09" x2="128" y2="232" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {product.units.toLocaleString()} units sold
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ₹{product.revenue.toLocaleString()}
                          </p>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              index === 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}>
                              #{index + 1}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Tab.Panel>

            <Tab.Panel className="p-4">
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  {summary.topSalesmen.map((salesman, index) => (
                    <li key={salesman.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-12 w-12">
                          {salesman.avatar ? (
                            <img
                              src={salesman.avatar}
                              alt={salesman.name}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><circle cx="80" cy="172" r="28" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="80" cy="60" r="28" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="176" cy="172" r="28" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="176" cy="60" r="28" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M32,224a60,60,0,0,1,96,0,60,60,0,0,1,96,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M32,112a60,60,0,0,1,96,0h0a60,60,0,0,1,96,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {salesman.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {salesman.orders.toLocaleString()} orders
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ₹{salesman.revenue.toLocaleString()}
                          </p>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              index === 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}>
                              #{index + 1}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Tab.Panel>

            <Tab.Panel className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={summary.topRegions}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                      >
                        {summary.topRegions.map((entry, index) => (
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
                  {summary.topRegions.map((region, index) => (
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
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default SalesPerformanceReport;