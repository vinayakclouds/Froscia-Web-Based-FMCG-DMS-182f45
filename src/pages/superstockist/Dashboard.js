import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import OrderSummary from "../../components/dashboard/OrderSummary";
import InventorySummary from "../../components/dashboard/InventorySummary";
import { Tab } from "@headlessui/react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    orderStats: {},
    inventoryStats: {},
    recentOrders: [],
    distributorPerformance: [],
    lowStockItems: []
  });

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real application, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Sample data for demonstration
      const mockData = {
        orderStats: {
          totalOrders: 156,
          pendingOrders: 22,
          completedOrders: 134,
          totalValue: 1250000
        },
        inventoryStats: {
          totalValue: 2450000,
          totalItems: 156,
          lowStockItems: 12,
          outOfStockItems: 3,
          recentUpdates: [
            {
              id: 1,
              productName: "Premium Cola 2L",
              stockLevel: 25,
              threshold: 30,
              status: "low"
            },
            {
              id: 2,
              productName: "Fruit Juice Mango 1L",
              stockLevel: 0,
              threshold: 20,
              status: "out"
            }
          ],
          categories: [
            { name: "Beverages", value: 35, percentage: 35 },
            { name: "Snacks", value: 28, percentage: 28 },
            { name: "Groceries", value: 22, percentage: 22 },
            { name: "Others", value: 15, percentage: 15 }
          ]
        },
        recentOrders: [
          {
            id: "ORD-2023-00156",
            date: "2023-10-15",
            distributor: {
              name: "Global Distribution Co.",
              id: "DST001",
              logo: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxEaXN0cmlidXRpb24lMkJjb21wYW55JTJCbG9nb3xlbnwwfHx8fDE3NDc5ODkxMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
            },
            amount: 45000,
            status: "pending"
          },
          {
            id: "ORD-2023-00155",
            date: "2023-10-14",
            distributor: {
              name: "City Distributors Ltd.",
              id: "DST002",
              logo: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxBbm90aGVyJTJCZGlzdHJpYnV0aW9uJTJCY29tcGFueSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkwNzI2fDA&ixlib=rb-4.1.0&q=80&w=1080"
            },
            amount: 78500,
            status: "processing"
          },
          {
            id: "ORD-2023-00154",
            date: "2023-10-13",
            distributor: {
              name: "Rural Market Networks",
              id: "DST003",
              logo: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxSdXJhbCUyQmRpc3RyaWJ1dGlvbiUyQmNvbXBhbnklMkJsb2dvfGVufDB8fHx8MTc0Nzk5MDcyOHww&ixlib=rb-4.1.0&q=80&w=1080"
            },
            amount: 36000,
            status: "delivered"
          }
        ],
        distributorPerformance: [
          {
            id: "DST001",
            name: "Global Distribution Co.",
            logo: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxEaXN0cmlidXRpb24lMkJjb21wYW55JTJCbG9nb3xlbnwwfHx8fDE3NDc5ODkxMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
            ordersThisMonth: 34,
            salesValue: 580000,
            growth: 12.5,
            target: 750000,
            achievement: 77
          },
          {
            id: "DST002",
            name: "City Distributors Ltd.",
            logo: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxBbm90aGVyJTJCZGlzdHJpYnV0aW9uJTJCY29tcGFueSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkwNzI2fDA&ixlib=rb-4.1.0&q=80&w=1080",
            ordersThisMonth: 28,
            salesValue: 420000,
            growth: -5.2,
            target: 500000,
            achievement: 84
          },
          {
            id: "DST003",
            name: "Rural Market Networks",
            logo: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxSdXJhbCUyQmRpc3RyaWJ1dGlvbiUyQmNvbXBhbnklMkJsb2dvfGVufDB8fHx8MTc0Nzk5MDcyOHww&ixlib=rb-4.1.0&q=80&w=1080",
            ordersThisMonth: 19,
            salesValue: 250000,
            growth: 8.7,
            target: 350000,
            achievement: 71
          }
        ],
        lowStockItems: [
          {
            id: "PRD001",
            name: "Premium Cola 2L",
            sku: "COLA-2L-001",
            currentStock: 25,
            minimumStock: 30,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxDb2xhJTJCYm90dGxlJTJCcHJvZHVjdCUyQmltYWdlfGVufDB8fHx8MTc0Nzk4OTcyMHww&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            id: "PRD002",
            name: "Fruit Juice Mango 1L",
            sku: "JUICE-MG-1L",
            currentStock: 0,
            minimumStock: 20,
            image: "https://images.unsplash.com/photo-1601924287811-e34de5d17476?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxNYW5nbyUyQmp1aWNlJTJCcGFja2V0JTJCaW1hZ2V8ZW58MHx8fHwxNzQ3OTg5NzIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            id: "PRD003",
            name: "Chips Classic 100g",
            sku: "CHIPS-CL-100",
            currentStock: 15,
            minimumStock: 25,
            image: "https://images.unsplash.com/photo-1576642589592-7d9778a1c9e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxDaGlwcyUyQnBhY2tldCUyQmltYWdlfGVufDB8fHx8MTc0Nzk5MDU4OXww&ixlib=rb-4.1.0&q=80&w=1080"
          }
        ]
      };
      
      setDashboardData(mockData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refreshData = () => {
    toast.loading("Refreshing dashboard data...");
    fetchDashboardData().then(() => toast.dismiss());
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow h-32">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow h-96">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow h-96">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-72 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Superstockist Dashboard</h1>
        <button
          onClick={refreshData}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><rect x="48" y="120" width="88" height="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M208,188v12a8,8,0,0,1-8,8H180" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="208" y1="116" x2="208" y2="140" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M184,48h16a8,8,0,0,1,8,8V72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="116" y1="48" x2="140" y2="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M48,76V56a8,8,0,0,1,8-8H68" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
          <span className="ml-1">Refresh</span>
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-800">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><path d="M188,184H91.17a16,16,0,0,1-15.74-13.14L48.73,24H24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="92" cy="204" r="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="188" cy="204" r="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M70.55,144H196.1a16,16,0,0,0,15.74-13.14L224,64H56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{dashboardData.orderStats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="128 72 128 128 184 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{dashboardData.orderStats.pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-800">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><polyline points="88 136 112 160 168 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{dashboardData.orderStats.completedOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-800">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="128" y1="72" x2="128" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="168" x2="128" y2="184" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M104,168h36a20,20,0,0,0,0-40H116a20,20,0,0,1,0-40h36" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(dashboardData.orderStats.totalValue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
              <Link 
                to="/superstockist/orders" 
                className="text-sm font-medium text-primary-600 hover:text-primary-800"
              >
                View All
              </Link>
            </div>
            <div className="px-6 pb-6">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Distributor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                          <Link to={`/superstockist/orders/${order.id}`}>
                            {order.id}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              {order.distributor.logo ? (
                                <img 
                                  className="h-8 w-8 rounded-full" 
                                  src={order.distributor.logo} 
                                  alt={order.distributor.name} 
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><polyline points="48 139.59 48 216 208 216 208 139.59" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M54,40H202a8,8,0,0,1,7.69,5.8L224,96H32L46.34,45.8A8,8,0,0,1,54,40Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M96,96v16a32,32,0,0,1-64,0V96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M160,96v16a32,32,0,0,1-64,0V96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M224,96v16a32,32,0,0,1-64,0V96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{order.distributor.name}</div>
                              <div className="text-sm text-gray-500">{order.distributor.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(order.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Low Stock Alert</h2>
              <Link 
                to="/superstockist/inventory" 
                className="text-sm font-medium text-primary-600 hover:text-primary-800"
              >
                View Inventory
              </Link>
            </div>
            <div className="space-y-4">
              {dashboardData.lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center p-4 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gray-100 overflow-hidden">
                    {item.image ? (
                      <img 
                        className="h-12 w-12 object-cover" 
                        src={item.image} 
                        alt={item.name} 
                      />
                    ) : (
                      <div className="h-12 w-12 flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><polyline points="32.7 76.92 128 129.08 223.3 76.92" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M131.84,25l88,48.18a8,8,0,0,1,4.16,7v95.64a8,8,0,0,1-4.16,7l-88,48.18a8,8,0,0,1-7.68,0l-88-48.18a8,8,0,0,1-4.16-7V80.18a8,8,0,0,1,4.16-7l88-48.18A8,8,0,0,1,131.84,25Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="129.09" x2="128" y2="232" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-medium text-gray-900">{item.currentStock} units</p>
                    <p className={`text-sm ${item.currentStock === 0 ? "text-red-600 font-medium" : "text-amber-600"}`}>
                      {item.currentStock === 0 ? "Out of Stock" : `Min: ${item.minimumStock}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Distributor Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Distributor Performance</h2>
              <Link 
                to="/superstockist/distributors" 
                className="text-sm font-medium text-primary-600 hover:text-primary-800"
              >
                View All
              </Link>
            </div>
            <div className="space-y-6">
              {dashboardData.distributorPerformance.map((distributor) => (
                <div key={distributor.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-10 w-10">
                      {distributor.logo ? (
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={distributor.logo} 
                          alt={distributor.name} 
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><polyline points="48 139.59 48 216 208 216 208 139.59" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M54,40H202a8,8,0,0,1,7.69,5.8L224,96H32L46.34,45.8A8,8,0,0,1,54,40Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M96,96v16a32,32,0,0,1-64,0V96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M160,96v16a32,32,0,0,1-64,0V96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M224,96v16a32,32,0,0,1-64,0V96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{distributor.name}</h3>
                      <p className="text-sm text-gray-500">{distributor.ordersThisMonth} orders this month</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(distributor.salesValue)}
                      </p>
                      <p className={`text-xs font-medium ${
                        distributor.growth >= 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {distributor.growth >= 0 ? "+" : ""}{distributor.growth}%
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-500">Target Achievement</span>
                      <span className="font-medium text-gray-900">{distributor.achievement}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          distributor.achievement >= 100
                            ? "bg-green-500"
                            : distributor.achievement >= 75
                            ? "bg-primary-500"
                            : distributor.achievement >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(100, distributor.achievement)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Reports */}
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-primary-100/20 p-1">
              <Tab 
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white/60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2 ${
                    selected
                      ? "bg-white text-primary-700 shadow"
                      : "text-gray-700 hover:bg-white/[0.12] hover:text-primary-600"
                  }`
                }
              >
                Order Summary
              </Tab>
              <Tab 
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white/60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2 ${
                    selected
                      ? "bg-white text-primary-700 shadow"
                      : "text-gray-700 hover:bg-white/[0.12] hover:text-primary-600"
                  }`
                }
              >
                Inventory Summary
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel>
                <OrderSummary data={dashboardData.orderStats} />
              </Tab.Panel>
              <Tab.Panel>
                <InventorySummary data={dashboardData.inventoryStats} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;