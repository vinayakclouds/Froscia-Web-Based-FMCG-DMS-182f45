import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from "recharts";
import { Tab } from "@headlessui/react";

const SalesmanPerformance = ({ data = null }) => {
  const [performanceData, setPerformanceData] = useState({
    salesmen: [],
    timeRange: "month"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSalesman, setSelectedSalesman] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // If real data is provided through props, use it
        if (data) {
          setPerformanceData({
            ...performanceData,
            salesmen: data.salesmen || []
          });
          setIsLoading(false);
          return;
        }

        // Otherwise use mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockData = {
          salesmen: [
            {
              id: "1",
              name: "John Smith",
              avatar: "https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxKb2huJTJCU21pdGglMkJwcm9maWxlJTJCcGhvdG98ZW58MHx8fHwxNzQ3OTkxMTc1fDA&ixlib=rb-4.1.0&q=80&w=1080",
              targetAmount: 250000,
              currentAmount: 195000,
              percentage: 78,
              status: "on-track",
              products: [
                { name: "Premium Cola", target: 1000, achieved: 850 },
                { name: "Fruit Juice", target: 800, achieved: 720 },
                { name: "Snack Chips", target: 1200, achieved: 650 }
              ],
              lastWeekPerformance: [
                { day: "Mon", sales: 8500 },
                { day: "Tue", sales: 9200 },
                { day: "Wed", sales: 7800 },
                { day: "Thu", sales: 10500 },
                { day: "Fri", sales: 9800 },
                { day: "Sat", sales: 11200 },
                { day: "Sun", sales: 6500 }
              ]
            },
            {
              id: "2",
              name: "Sarah Johnson",
              avatar: "https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxTYXJhaCUyQkpvaG5zb24lMkJwcm9maWxlJTJCcGhvdG98ZW58MHx8fHwxNzQ3OTkxMTgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
              targetAmount: 200000,
              currentAmount: 210000,
              percentage: 105,
              status: "exceeded",
              products: [
                { name: "Premium Cola", target: 900, achieved: 950 },
                { name: "Fruit Juice", target: 750, achieved: 820 },
                { name: "Snack Chips", target: 1000, achieved: 1050 }
              ],
              lastWeekPerformance: [
                { day: "Mon", sales: 9500 },
                { day: "Tue", sales: 8200 },
                { day: "Wed", sales: 10800 },
                { day: "Thu", sales: 9500 },
                { day: "Fri", sales: 11800 },
                { day: "Sat", sales: 10200 },
                { day: "Sun", sales: 7500 }
              ]
            },
            {
              id: "3",
              name: "Robert Chen",
              avatar: "https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxSb2JlcnQlMkJDaGVuJTJCcHJvZmlsZSUyQnBob3RvfGVufDB8fHx8MTc0Nzk5MTE4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
              targetAmount: 180000,
              currentAmount: 125000,
              percentage: 69,
              status: "at-risk",
              products: [
                { name: "Premium Cola", target: 800, achieved: 550 },
                { name: "Fruit Juice", target: 700, achieved: 480 },
                { name: "Snack Chips", target: 900, achieved: 650 }
              ],
              lastWeekPerformance: [
                { day: "Mon", sales: 6500 },
                { day: "Tue", sales: 7200 },
                { day: "Wed", sales: 5800 },
                { day: "Thu", sales: 7500 },
                { day: "Fri", sales: 6800 },
                { day: "Sat", sales: 7200 },
                { day: "Sun", sales: 5500 }
              ]
            }
          ]
        };
        
        setPerformanceData(mockData);
        setSelectedSalesman(mockData.salesmen[0]);
      } catch (error) {
        console.error("Error fetching salesman performance data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [data]);

  const handleTimeRangeChange = (range) => {
    setPerformanceData({
      ...performanceData,
      timeRange: range
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "exceeded":
        return "text-green-600";
      case "on-track":
        return "text-blue-600";
      case "at-risk":
        return "text-amber-600";
      case "behind":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "exceeded":
        return "bg-green-100";
      case "on-track":
        return "bg-blue-100";
      case "at-risk":
        return "bg-amber-100";
      case "behind":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  const getBarColor = (percentage) => {
    if (percentage >= 100) return "#10B981"; // Green
    if (percentage >= 75) return "#3B82F6";  // Blue
    if (percentage >= 50) return "#F59E0B";  // Amber
    return "#EF4444";                        // Red
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded col-span-1"></div>
            <div className="h-24 bg-gray-200 rounded col-span-2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Salesman Performance</h3>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handleTimeRangeChange("week")}
              className={`px-3 py-1 text-xs rounded-full font-medium ${
                performanceData.timeRange === "week"
                  ? "bg-primary-100 text-primary-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => handleTimeRangeChange("month")}
              className={`px-3 py-1 text-xs rounded-full font-medium ${
                performanceData.timeRange === "month"
                  ? "bg-primary-100 text-primary-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => handleTimeRangeChange("quarter")}
              className={`px-3 py-1 text-xs rounded-full font-medium ${
                performanceData.timeRange === "quarter"
                  ? "bg-primary-100 text-primary-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Quarter
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Overall Target Achievement */}
        <div className="space-y-4">
          {performanceData.salesmen.map((salesman) => (
            <div 
              key={salesman.id}
              className={`p-4 rounded-lg ${
                selectedSalesman?.id === salesman.id ? "bg-gray-50 border border-gray-200" : ""
              } cursor-pointer hover:bg-gray-50`}
              onClick={() => setSelectedSalesman(salesman)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                    {salesman.avatar ? (
                      <img src={salesman.avatar} alt={salesman.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="120" r="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M57.78,216a72,72,0,0,1,140.44,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">{salesman.name}</h4>
                    <div className="flex items-center mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBgColor(
                          salesman.status
                        )} ${getStatusColor(salesman.status)}`}
                      >
                        {salesman.status === "exceeded" && "Exceeded"}
                        {salesman.status === "on-track" && "On Track"}
                        {salesman.status === "at-risk" && "At Risk"}
                        {salesman.status === "behind" && "Behind"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {salesman.percentage}%
                    </span>
                    <div className="ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="48" y1="216" x2="48" y2="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="48 56 176 56 176 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="48 104 224 104 224 152 48 152" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="144 152 144 200 48 200" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    ₹{salesman.currentAmount.toLocaleString()} of ₹{salesman.targetAmount.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full"
                    style={{
                      width: `${Math.min(100, salesman.percentage)}%`,
                      backgroundColor: getBarColor(salesman.percentage)
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Performance for Selected Salesman */}
        {selectedSalesman && (
          <div className="mt-6 pt-6 border-t border-gray-200">
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
                  Daily Sales
                </Tab>
              </Tab.List>
              <Tab.Panels className="mt-6">
                {/* Product Performance Panel */}
                <Tab.Panel>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={selectedSalesman.products}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip
                          formatter={(value, name) => [
                            value,
                            name === "target" ? "Target Units" : "Achieved Units"
                          ]}
                        />
                        <Legend />
                        <ReferenceLine x={0} stroke="#000" />
                        <Bar dataKey="target" fill="#8884d8" name="Target Units" />
                        <Bar dataKey="achieved" fill="#82ca9d" name="Achieved Units">
                          {selectedSalesman.products.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.achieved >= entry.target ? "#10B981" : "#3B82F6"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Tab.Panel>
                
                {/* Daily Sales Panel */}
                <Tab.Panel>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={selectedSalesman.lastWeekPerformance}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`₹${value.toLocaleString()}`, "Sales"]}
                        />
                        <Legend />
                        <Bar dataKey="sales" name="Daily Sales" fill="#3B82F6">
                          {selectedSalesman.lastWeekPerformance.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.day === "Sat" || entry.day === "Sun"
                                  ? "#93C5FD"
                                  : "#3B82F6"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesmanPerformance;