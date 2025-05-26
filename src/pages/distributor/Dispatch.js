import React, { useState, useEffect, useCallback } from "react";
import DispatchTable from "../../components/dispatch/DispatchTable";
import DeliveryUpdateForm from "../../components/forms/DeliveryUpdateForm";
import { Dialog, Tab, Transition } from "@headlessui/react";
import toast from "react-hot-toast";

const Dispatch = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const [stats, setStats] = useState({
    pendingOrders: 0,
    readyForDispatchOrders: 0,
    outForDeliveryOrders: 0,
    deliveredOrders: 0,
    failedOrders: 0
  });

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample data
      const mockOrders = [
        {
          id: "1",
          orderNumber: "ORD-2023-001",
          orderDate: "2023-10-15T10:30:00Z",
          expectedDelivery: "2023-10-17T17:00:00Z",
          status: "ready_for_dispatch",
          lastUpdated: "2023-10-15T14:45:00Z",
          totalAmount: 6300.00,
          retailer: {
            name: "SuperMart Store",
            phone: "+91 98765 43210",
            logo: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxTdXBlck1hcnQlMkJzdG9yZSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkxOTY2fDA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          shippingAddress: {
            street: "123 Main Street, Andheri East",
            city: "Mumbai",
            pincode: "400069"
          },
          items: [
            {
              name: "Premium Cola 2L",
              image: "https://images.unsplash.com/photo-1574670700790-fa314ab37787?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxDb2xhJTJCYm90dGxlfGVufDB8fHx8MTc0Nzk5MTk2OHww&ixlib=rb-4.1.0&q=80&w=1080"
            },
            {
              name: "Fruit Juice Mango 1L",
              image: "https://images.unsplash.com/photo-1601924287811-e34de5d17476?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxNYW5nbyUyQmp1aWNlJTJCcGFja2V0fGVufDB8fHx8MTc0Nzk5MTk2OXww&ixlib=rb-4.1.0&q=80&w=1080"
            }
          ]
        },
        {
          id: "2",
          orderNumber: "ORD-2023-002",
          orderDate: "2023-10-14T15:45:00Z",
          expectedDelivery: "2023-10-16T17:00:00Z",
          status: "out_for_delivery",
          lastUpdated: "2023-10-15T09:30:00Z",
          totalAmount: 4000.00,
          retailer: {
            name: "Quick Stop",
            phone: "+91 87654 32109",
            logo: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxRdWljayUyQlN0b3AlMkJzdG9yZSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkxOTcyfDA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          shippingAddress: {
            street: "45, Hill Road, Bandra West",
            city: "Mumbai",
            pincode: "400050"
          },
          items: [
            {
              name: "Chips Classic 100g",
              image: "https://images.unsplash.com/photo-1576642589592-7d9778a1c9e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxDaGlwcyUyQnBhY2tldHxlbnwwfHx8fDE3NDc5OTE5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
            }
          ]
        },
        {
          id: "3",
          orderNumber: "ORD-2023-003",
          orderDate: "2023-10-13T11:20:00Z",
          expectedDelivery: "2023-10-15T17:00:00Z",
          status: "delivered",
          lastUpdated: "2023-10-15T16:15:00Z",
          totalAmount: 8750.00,
          retailer: {
            name: "Family Grocers",
            phone: "+91 76543 21098",
            logo: "https://images.unsplash.com/photo-1523951778169-4cb35545bfa2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxGYW1pbHklMkJHcm9jZXJzJTJCc3RvcmUlMkJsb2dvfGVufDB8fHx8MTc0Nzk5MTk3N3ww&ixlib=rb-4.1.0&q=80&w=1080"
          },
          shippingAddress: {
            street: "78, Market Complex, Dadar",
            city: "Mumbai",
            pincode: "400014"
          },
          items: [
            {
              name: "Premium Biscuits 500g",
              image: "https://images.unsplash.com/photo-1588195540875-63c2be0f60ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxCaXNjdWl0JTJCcGFja2V0fGVufDB8fHx8MTc0Nzk5MTk3OXww&ixlib=rb-4.1.0&q=80&w=1080"
            },
            {
              name: "Cooking Oil 5L",
              image: "https://images.unsplash.com/photo-1556760544-74068565f05c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxPaWwlMkJib3R0bGV8ZW58MHx8fHwxNzQ3OTkxOTgwfDA&ixlib=rb-4.1.0&q=80&w=1080"
            }
          ]
        },
        {
          id: "4",
          orderNumber: "ORD-2023-004",
          orderDate: "2023-10-15T09:10:00Z",
          expectedDelivery: "2023-10-17T17:00:00Z",
          status: "pending",
          lastUpdated: "2023-10-15T09:10:00Z",
          totalAmount: 3250.00,
          retailer: {
            name: "Mini Market",
            phone: "+91 65432 10987",
            logo: "https://images.unsplash.com/photo-1517137744310-173515c62d59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxNaW5pJTJCTWFya2V0JTJCc3RvcmUlMkJsb2dvfGVufDB8fHx8MTc0Nzk5MTk4NHww&ixlib=rb-4.1.0&q=80&w=1080"
          },
          shippingAddress: {
            street: "12, Shopping Center, Malad West",
            city: "Mumbai",
            pincode: "400064"
          },
          items: [
            {
              name: "Energy Drink 250ml",
              image: "https://images.unsplash.com/photo-1500217052183-bc01eee1a74e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxFbmVyZ3klMkJkcmluayUyQmNhbnxlbnwwfHx8fDE3NDc5OTE5ODV8MA&ixlib=rb-4.1.0&q=80&w=1080"
            }
          ]
        },
        {
          id: "5",
          orderNumber: "ORD-2023-005",
          orderDate: "2023-10-12T16:40:00Z",
          expectedDelivery: "2023-10-14T17:00:00Z",
          status: "failed",
          lastUpdated: "2023-10-14T18:30:00Z",
          totalAmount: 5600.00,
          retailer: {
            name: "Corner Shop",
            phone: "+91 54321 09876",
            logo: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxDb3JuZXIlMkJTaG9wJTJCc3RvcmUlMkJsb2dvfGVufDB8fHx8MTc0Nzk5MTk5MHww&ixlib=rb-4.1.0&q=80&w=1080"
          },
          shippingAddress: {
            street: "56, Main Road, Goregaon",
            city: "Mumbai",
            pincode: "400062"
          },
          items: [
            {
              name: "Premium Tea 1kg",
              image: "https://images.unsplash.com/photo-1523920290228-4f321a939b4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxUZWElMkJwYWNrZXR8ZW58MHx8fHwxNzQ3OTkxOTkyfDA&ixlib=rb-4.1.0&q=80&w=1080"
            }
          ]
        }
      ];
      
      setOrders(mockOrders);
      
      // Update stats
      setStats({
        pendingOrders: mockOrders.filter(order => order.status === "pending").length,
        readyForDispatchOrders: mockOrders.filter(order => order.status === "ready_for_dispatch").length,
        outForDeliveryOrders: mockOrders.filter(order => order.status === "out_for_delivery").length,
        deliveredOrders: mockOrders.filter(order => order.status === "delivered").length,
        failedOrders: mockOrders.filter(order => order.status === "failed").length
      });
      
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateDeliveryStatus = async (orderId, newStatus) => {
    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                lastUpdated: new Date().toISOString()
              }
            : order
        )
      );
      
      // Update stats
      const updatedOrders = orders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      );
      
      setStats({
        pendingOrders: updatedOrders.filter(order => order.status === "pending").length,
        readyForDispatchOrders: updatedOrders.filter(order => order.status === "ready_for_dispatch").length,
        outForDeliveryOrders: updatedOrders.filter(order => order.status === "out_for_delivery").length,
        deliveredOrders: updatedOrders.filter(order => order.status === "delivered").length,
        failedOrders: updatedOrders.filter(order => order.status === "failed").length
      });
      
      return true;
    } catch (error) {
      console.error("Error updating delivery status:", error);
      toast.error("Failed to update delivery status");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeliveryUpdate = async (formData) => {
    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const orderId = formData.get("orderId");
      const deliveryStatus = formData.get("deliveryStatus");
      const receiverName = formData.get("receiverName");
      const receiverPhone = formData.get("receiverPhone");
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? {
                ...order,
                status: deliveryStatus,
                lastUpdated: new Date().toISOString(),
                receiverName,
                receiverPhone
              }
            : order
        )
      );
      
      setShowUpdateModal(false);
      setSelectedOrder(null);
      
      // Refresh stats
      fetchOrders();
      
      toast.success(`Delivery status updated to ${deliveryStatus.replace("_", " ")}`);
    } catch (error) {
      console.error("Error updating delivery:", error);
      toast.error("Failed to update delivery information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowUpdateModal(true);
  };

  const handlePrintInvoice = async (orderId) => {
    try {
      toast.loading("Generating invoice...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.dismiss();
      toast.success("Invoice generated successfully!");
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Failed to generate invoice");
    }
  };

  const handlePrintDeliveryNote = async (orderId) => {
    try {
      toast.loading("Generating delivery note...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.dismiss();
      toast.success("Delivery note generated successfully!");
    } catch (error) {
      console.error("Error generating delivery note:", error);
      toast.error("Failed to generate delivery note");
    }
  };

  // Filter orders based on search query, status and date
  const filteredOrders = orders.filter(order => {
    // Search filter
    const searchFilter =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.retailer.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const statusFilterMatch = statusFilter === "all" || order.status === statusFilter;

    // Date filter (simplified for this example)
    let dateFilterMatch = true;
    if (dateFilter === "today") {
      const today = new Date().toISOString().split("T")[0];
      dateFilterMatch = order.orderDate.startsWith(today);
    } else if (dateFilter === "yesterday") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      dateFilterMatch = order.orderDate.startsWith(yesterdayStr);
    } else if (dateFilter === "this_week") {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      dateFilterMatch = new Date(order.orderDate) >= startOfWeek;
    }

    return searchFilter && statusFilterMatch && dateFilterMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Dispatch Management</h3>
            <p className="mt-1 text-sm text-gray-500">
              Process and track outbound orders for delivery
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 rounded-full bg-yellow-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="128 72 128 128 184 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">Pending</p>
                <p className="text-2xl font-semibold text-yellow-900">
                  {stats.pendingOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 rounded-full bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><polyline points="32.7 76.92 128 129.08 223.3 76.92" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="129.09" x2="128" y2="231.97" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M219.84,182.84l-88,48.18a8,8,0,0,1-7.68,0l-88-48.18a8,8,0,0,1-4.16-7V80.18a8,8,0,0,1,4.16-7l88-48.18a8,8,0,0,1,7.68,0l88,48.18a8,8,0,0,1,4.16,7v95.64A8,8,0,0,1,219.84,182.84Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="81.56 48.31 176 100 176 152" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">Ready for Dispatch</p>
                <p className="text-2xl font-semibold text-blue-900">
                  {stats.readyForDispatchOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 rounded-full bg-purple-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><circle cx="220" cy="184" r="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="36" cy="184" r="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="84" cy="184" r="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="196" y1="184" x2="108" y2="184" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M156,184V56a8,8,0,0,1,8-8h0a48,48,0,0,1,48,48v8h0a32,32,0,0,1,32,32v48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M116,184V72H20a8,8,0,0,0-8,8V184" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-800">Out for Delivery</p>
                <p className="text-2xl font-semibold text-purple-900">
                  {stats.outForDeliveryOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 rounded-full bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><polyline points="88 136 112 160 168 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Delivered</p>
                <p className="text-2xl font-semibold text-green-900">
                  {stats.deliveredOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 rounded-full bg-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="160" y1="96" x2="96" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="96" y1="96" x2="160" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">Failed</p>
                <p className="text-2xl font-semibold text-red-900">
                  {stats.failedOrders}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Orders
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="80" y1="112" x2="144" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="112" cy="112" r="80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="168.57" y1="168.57" x2="224" y2="224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="112" y1="80" x2="112" y2="144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search by order number or retailer"
              />
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="ready_for_dispatch">Ready for Dispatch</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <select
              id="date"
              name="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="this_week">This Week</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dispatch Table */}
      <DispatchTable
        orders={filteredOrders}
        isLoading={isLoading}
        onUpdateDeliveryStatus={handleUpdateDeliveryStatus}
        onViewDetails={handleViewDetails}
        onPrintInvoice={handlePrintInvoice}
        onPrintDeliveryNote={handlePrintDeliveryNote}
      />

      {/* Delivery Update Modal */}
      <Transition show={showUpdateModal} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setShowUpdateModal(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Update Delivery Status
                </Dialog.Title>
                
                {selectedOrder && (
                  <DeliveryUpdateForm
                    order={selectedOrder}
                    onUpdate={handleDeliveryUpdate}
                    onCancel={() => setShowUpdateModal(false)}
                  />
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Quick Help Tips */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <div className="flex">
          <div className="flex-shrink-0 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="88" y1="232" x2="168" y2="232" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M78.7,167A79.87,79.87,0,0,1,48,104.45C47.76,61.09,82.72,25,126.07,24a80,80,0,0,1,51.34,142.9A24.3,24.3,0,0,0,168,186v2a8,8,0,0,1-8,8H96a8,8,0,0,1-8-8v-2A24.11,24.11,0,0,0,78.7,167Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M140,70a36.39,36.39,0,0,1,24,30" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Tips for efficient dispatch</h3>
            <div className="mt-2 text-sm text-blue-700 space-y-1">
              <p>• Group orders by delivery areas to optimize routes</p>
              <p>• Use the "Ready for Dispatch" filter to prioritize pending deliveries</p>
              <p>• Always update delivery status promptly for better tracking</p>
              <p>• Print delivery notes for all outbound packages</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dispatch;