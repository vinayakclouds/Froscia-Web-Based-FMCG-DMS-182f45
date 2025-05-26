import React, { useState, useEffect, useMemo } from "react";
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
import { format, subDays, isAfter, isBefore, parseISO } from "date-fns";
import { Tab } from "@headlessui/react";
import toast from "react-hot-toast";

const InventoryReport = ({
  dateRange,
  filters = {},
  onDataLoad
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [inventoryData, setInventoryData] = useState([]);
  const [selectedView, setSelectedView] = useState("overview");
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [locationBreakdown, setLocationBreakdown] = useState([]);
  const [stockAlerts, setStockAlerts] = useState({
    lowStock: [],
    overStock: [],
    expiringSoon: []
  });

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D"
  ];

  // Fetch report data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulated API call - replace with actual API integration
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Sample inventory data
        const mockInventoryData = [
          {
            date: subDays(new Date(), 30).toISOString(),
            totalStock: 15000,
            stockValue: 750000,
            categories: {
              beverages: 5000,
              snacks: 4000,
              groceries: 6000
            },
            locations: {
              "Main Warehouse": 8000,
              "North Warehouse": 4000,
              "South Warehouse": 3000
            }
          },
          // ... more historical data points
        ];

        // Sample category breakdown
        const mockCategoryBreakdown = [
          { name: "Beverages", value: 5000, stockValue: 250000 },
          { name: "Snacks", value: 4000, stockValue: 200000 },
          { name: "Groceries", value: 6000, stockValue: 300000 }
        ];

        // Sample location breakdown
        const mockLocationBreakdown = [
          { name: "Main Warehouse", value: 8000, stockValue: 400000 },
          { name: "North Warehouse", value: 4000, stockValue: 200000 },
          { name: "South Warehouse", value: 3000, stockValue: 150000 }
        ];

        // Sample stock alerts
        const mockStockAlerts = {
          lowStock: [
            {
              id: "1",
              name: "Premium Cola 2L",
              sku: "COLA-2L-001",
              currentStock: 100,
              minStock: 500,
              location: "Main Warehouse",
              image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxDb2xhJTJCYm90dGxlJTJCcHJvZHVjdCUyQmltYWdlfGVufDB8fHx8MTc0Nzk4OTcyMHww&ixlib=rb-4.1.0&q=80&w=1080"
            }
          ],
          overStock: [
            {
              id: "2",
              name: "Fruit Juice Mango 1L",
              sku: "JUICE-MG-1L",
              currentStock: 2000,
              maxStock: 1500,
              location: "North Warehouse",
              image: "https://images.unsplash.com/photo-1601924287811-e34de5d17476?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxNYW5nbyUyQmp1aWNlJTJCcGFja2V0JTJCaW1hZ2V8ZW58MHx8fHwxNzQ3OTg5NzIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
            }
          ],
          expiringSoon: [
            {
              id: "3",
              name: "Chips Classic 100g",
              sku: "CHIPS-CL-100",
              currentStock: 300,
              expiryDate: "2024-01-15",
              location: "South Warehouse",
              image: "https://images.unsplash.com/photo-1576642589592-7d9778a1c9e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxDaGlwcyUyQnBhY2tldCUyQmltYWdlfGVufDB8fHx8MTc0Nzk5MDU4OXww&ixlib=rb-4.1.0&q=80&w=1080"
            }
          ]
        };

        setInventoryData(mockInventoryData);
        setCategoryBreakdown(mockCategoryBreakdown);
        setLocationBreakdown(mockLocationBreakdown);
        setStockAlerts(mockStockAlerts);

        if (onDataLoad) {
          onDataLoad({
            totalStock: mockInventoryData[0].totalStock,
            stockValue: mockInventoryData[0].stockValue,
            categoryBreakdown: mockCategoryBreakdown,
            locationBreakdown: mockLocationBreakdown,
            alerts: mockStockAlerts
          });
        }
      } catch (error) {
        console.error("Error fetching inventory report data:", error);
        toast.error("Failed to load inventory report data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange, filters, onDataLoad]);

  const renderStockAlerts = (alerts, title, icon) => (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-full bg-red-100">
          {icon}
        </div>
        <h3 className="ml-3 text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <div className="space-y-4">
        {alerts.map(item => (
          <div key={item.id} className="flex items-center space-x-4">
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
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </p>
              <p className="text-sm text-gray-500">
                SKU: {item.sku}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {item.currentStock} units
              </p>
              <p className="text-sm text-gray-500">
                {item.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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
      {/* View Selector */}
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
              onClick={() => setSelectedView("overview")}
            >
              Overview
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                  selected
                    ? "bg-white shadow text-primary-700"
                    : "text-gray-700 hover:bg-white/[0.12] hover:text-gray-900"
                }`
              }
              onClick={() => setSelectedView("categories")}
            >
              Categories
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                  selected
                    ? "bg-white shadow text-primary-700"
                    : "text-gray-700 hover:bg-white/[0.12] hover:text-gray-900"
                }`
              }
              onClick={() => setSelectedView("locations")}
            >
              Locations
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                  selected
                    ? "bg-white shadow text-primary-700"
                    : "text-gray-700 hover:bg-white/[0.12] hover:text-gray-900"
                }`
              }
              onClick={() => setSelectedView("alerts")}
            >
              Alerts
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-6">
            {/* Overview Panel */}
            <Tab.Panel>
              <div className="space-y-6">
                {/* Stock Overview Chart */}
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Stock Level Trends</h3>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={inventoryData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
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

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Total Stock */}
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><polyline points="32.7 76.92 128 129.08 223.3 76.92" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M131.84,25l88,48.18a8,8,0,0,1,4.16,7v95.64a8,8,0,0,1-4.16,7l-88,48.18a8,8,0,0,1-7.68,0l-88-48.18a8,8,0,0,1-4.16-7V80.18a8,8,0,0,1,4.16-7l88-48.18A8,8,0,0,1,131.84,25Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="129.09" x2="128" y2="232" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Total Stock</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {inventoryData[0]?.totalStock.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stock Value */}
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-green-100 text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="128" y1="72" x2="128" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="168" x2="128" y2="184" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M104,168h36a20,20,0,0,0,0-40H116a20,20,0,0,1,0-40h36" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Stock Value</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          ₹{inventoryData[0]?.stockValue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Alert Summary */}
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-red-100 text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="132" x2="128" y2="80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="172" r="16"/></svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Active Alerts</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {stockAlerts.lowStock.length +
                            stockAlerts.overStock.length +
                            stockAlerts.expiringSoon.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Categories Panel */}
            <Tab.Panel>
              <div className="space-y-6">
                {/* Category Distribution Chart */}
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Category Distribution</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryBreakdown}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={({ name, percent }) =>
                              `${name} (${(percent * 100).toFixed(0)}%)`
                            }
                          >
                            {categoryBreakdown.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value.toLocaleString()} units`]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                      {categoryBreakdown.map((category, index) => (
                        <div
                          key={category.name}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {category.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {category.value.toLocaleString()} units
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                ₹{category.stockValue.toLocaleString()}
                              </p>
                              <div
                                className="h-3 w-3 ml-2 rounded-full inline-block"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Locations Panel */}
            <Tab.Panel>
              <div className="space-y-6">
                {/* Location Distribution Chart */}
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Warehouse Distribution</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={locationBreakdown}>
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
                    <div className="space-y-4">
                      {locationBreakdown.map((location) => (
                        <div
                          key={location.name}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <h4 className="text-sm font-medium text-gray-900">
                            {location.name}
                          </h4>
                          <div className="mt-2 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Stock Units</p>
                              <p className="text-sm font-medium text-gray-900">
                                {location.value.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Stock Value</p>
                              <p className="text-sm font-medium text-gray-900">
                                ₹{location.stockValue.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Alerts Panel */}
            <Tab.Panel>
              <div className="space-y-6">
                {/* Low Stock Alerts */}
                {stockAlerts.lowStock.length > 0 && (
                  renderStockAlerts(
                    stockAlerts.lowStock,
                    "Low Stock Alerts",
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="132" x2="128" y2="80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="172" r="16"/></svg>
                  )
                )}

                {/* Over Stock Alerts */}
                {stockAlerts.overStock.length > 0 && (
                  renderStockAlerts(
                    stockAlerts.overStock,
                    "Over Stock Alerts",
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><polyline points="104 80 152 32 200 80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M56,224a96,96,0,0,0,96-96V32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  )
                )}

                {/* Expiring Soon Alerts */}
                {stockAlerts.expiringSoon.length > 0 && (
                  renderStockAlerts(
                    stockAlerts.expiringSoon,
                    "Expiring Soon",
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="128 72 128 128 184 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  )
                )}

                {/* No Alerts Message */}
                {stockAlerts.lowStock.length === 0 &&
                  stockAlerts.overStock.length === 0 &&
                  stockAlerts.expiringSoon.length === 0 && (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <div className="mx-auto h-12 w-12 text-green-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="48" height="48"><rect width="256" height="256" fill="none"/><polyline points="88 136 112 160 168 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No Active Alerts</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      All inventory levels are within normal ranges
                    </p>
                  </div>
                )}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default InventoryReport;