import React, { useState, useEffect, useCallback } from "react";
import ReturnsTable from "../../components/returns/ReturnsTable";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    date: "all",
    search: ""
  });

  const [stats, setStats] = useState({
    totalReturns: 0,
    pendingReturns: 0,
    approvedReturns: 0,
    rejectedReturns: 0,
    totalValue: 0
  });

  const fetchReturns = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockReturns = [
        {
          id: "RTN-2023-001",
          returnId: "RTN-2023-001",
          orderId: "ORD-2023-156",
          returnDate: "2023-10-15T10:30:00Z",
          retailer: {
            name: "SuperMart Store",
            phone: "+91 98765 43210",
            logo: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxTdXBlck1hcnQlMkJzdG9yZSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkxOTY2fDA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          items: [
            {
              id: "1",
              name: "Premium Cola 2L",
              quantity: 10,
              reason: "Damaged in transit",
              image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxDb2xhJTJCYm90dGxlJTJCcHJvZHVjdCUyQmltYWdlfGVufDB8fHx8MTc0Nzk4OTcyMHww&ixlib=rb-4.1.0&q=80&w=1080"
            }
          ],
          status: "pending",
          totalValue: 450.00
        },
        {
          id: "RTN-2023-002",
          returnId: "RTN-2023-002",
          orderId: "ORD-2023-148",
          returnDate: "2023-10-14T15:45:00Z",
          retailer: {
            name: "Quick Stop",
            phone: "+91 87654 32109",
            logo: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxRdWljayUyQlN0b3AlMkJzdG9yZSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkxOTcyfDA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          items: [
            {
              id: "2",
              name: "Fruit Juice Mango 1L",
              quantity: 15,
              reason: "Near expiry",
              image: "https://images.unsplash.com/photo-1601924287811-e34de5d17476?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxNYW5nbyUyQmp1aWNlJTJCcGFja2V0JTJCaW1hZ2V8ZW58MHx8fHwxNzQ3OTg5NzIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
            }
          ],
          status: "approved",
          totalValue: 525.00
        }
      ];
      
      setReturns(mockReturns);
      
      // Update stats
      setStats({
        totalReturns: mockReturns.length,
        pendingReturns: mockReturns.filter(r => r.status === "pending").length,
        approvedReturns: mockReturns.filter(r => r.status === "approved").length,
        rejectedReturns: mockReturns.filter(r => r.status === "rejected").length,
        totalValue: mockReturns.reduce((sum, r) => sum + r.totalValue, 0)
      });
      
    } catch (error) {
      console.error("Error fetching returns:", error);
      toast.error("Failed to load returns data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  const handleApproveReturn = async (returnId) => {
    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReturns(prevReturns =>
        prevReturns.map(r =>
          r.id === returnId
            ? { ...r, status: "approved" }
            : r
        )
      );
      
      fetchReturns(); // Refresh stats
      toast.success("Return request approved successfully");
      
    } catch (error) {
      console.error("Error approving return:", error);
      toast.error("Failed to approve return request");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectReturn = async (returnId) => {
    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReturns(prevReturns =>
        prevReturns.map(r =>
          r.id === returnId
            ? { ...r, status: "rejected" }
            : r
        )
      );
      
      fetchReturns(); // Refresh stats
      toast.success("Return request rejected successfully");
      
    } catch (error) {
      console.error("Error rejecting return:", error);
      toast.error("Failed to reject return request");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessReturn = async (returnId) => {
    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReturns(prevReturns =>
        prevReturns.map(r =>
          r.id === returnId
            ? { ...r, status: "processing" }
            : r
        )
      );
      
      fetchReturns(); // Refresh stats
      toast.success("Return is now being processed");
      
    } catch (error) {
      console.error("Error processing return:", error);
      toast.error("Failed to process return");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (returnItem) => {
    setSelectedReturn(returnItem);
    setShowViewModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Returns Management</h3>
            <p className="mt-1 text-sm text-gray-500">
              Process and manage product returns from retailers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><rect x="32" y="48" width="192" height="160" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-800">Total Returns</p>
                <p className="text-2xl font-semibold text-purple-900">
                  {stats.totalReturns}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="128 72 128 128 184 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">Pending</p>
                <p className="text-2xl font-semibold text-yellow-900">
                  {stats.pendingReturns}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><polyline points="88 136 112 160 168 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Approved</p>
                <p className="text-2xl font-semibold text-green-900">
                  {stats.approvedReturns}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="160" y1="96" x2="96" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="96" y1="96" x2="160" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">Rejected</p>
                <p className="text-2xl font-semibold text-red-900">
                  {stats.rejectedReturns}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="128" y1="72" x2="128" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="168" x2="128" y2="184" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M104,168h36a20,20,0,0,0,0-40H116a20,20,0,0,1,0-40h36" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">Total Value</p>
                <p className="text-2xl font-semibold text-blue-900">
                  ₹{stats.totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Returns
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="80" y1="112" x2="144" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="112" cy="112" r="80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="168.57" y1="168.57" x2="224" y2="224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="112" y1="80" x2="112" y2="144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search by return ID or retailer"
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
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <select
              id="date"
              name="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Returns Table */}
      <ReturnsTable
        returns={returns}
        isLoading={isLoading}
        onApproveReturn={handleApproveReturn}
        onRejectReturn={handleRejectReturn}
        onProcessReturn={handleProcessReturn}
        onViewDetails={handleViewDetails}
      />

      {/* View Return Details Modal */}
      <Transition show={showViewModal} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setShowViewModal(false)}
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
              <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                {selectedReturn && (
                  <>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Return Request Details
                    </Dialog.Title>

                    <div className="mt-4 space-y-6">
                      {/* Return Info */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Return ID</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedReturn.returnId}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Original Order</p>
                            <p className="mt-1 text-sm text-primary-600">{selectedReturn.orderId}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Return Date</p>
                            <p className="mt-1 text-sm text-gray-900">
                              {new Date(selectedReturn.returnDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Status</p>
                            <span className={`inline-flex mt-1 items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              selectedReturn.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : selectedReturn.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : selectedReturn.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {selectedReturn.status.charAt(0).toUpperCase() + selectedReturn.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Retailer Info */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Retailer Information</h4>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {selectedReturn.retailer.logo ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={selectedReturn.retailer.logo}
                                alt={selectedReturn.retailer.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="16" y1="216" x2="240" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="224 216 224 76 176 76 176 40 80 40 80 112 32 112 32 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="76" x2="136" y2="76" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="112" x2="136" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="112" x2="188" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="68" y1="148" x2="84" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="148" x2="136" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="148" x2="188" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M148,216V176a4,4,0,0,0-4-4H112a4,4,0,0,0-4,4v40Z"/></svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">{selectedReturn.retailer.name}</p>
                            <p className="text-sm text-gray-500">{selectedReturn.retailer.phone}</p>
                          </div>
                        </div>
                      </div>

                      {/* Return Items */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Returned Items</h4>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Product
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Quantity
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Reason
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {selectedReturn.items.map((item) => (
                                <tr key={item.id}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-10 w-10">
                                        {item.image ? (
                                          <img
                                            className="h-10 w-10 rounded-lg object-cover"
                                            src={item.image}
                                            alt={item.name}
                                          />
                                        ) : (
                                          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><polyline points="32.7 76.92 128 129.08 223.3 76.92" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M131.84,25l88,48.18a8,8,0,0,1,4.16,7v95.64a8,8,0,0,1-4.16,7l-88,48.18a8,8,0,0,1-7.68,0l-88-48.18a8,8,0,0,1-4.16-7V80.18a8,8,0,0,1,4.16-7l88-48.18A8,8,0,0,1,131.84,25Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="129.09" x2="128" y2="232" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                                          </div>
                                        )}
                                      </div>
                                      <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.quantity}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.reason}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Total Value */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium text-gray-900">Total Return Value</p>
                          <p className="text-lg font-semibold text-gray-900">
                            ₹{selectedReturn.totalValue.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowViewModal(false)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Close
                        </button>
                        {selectedReturn.status === "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApproveReturn(selectedReturn.id)}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                            >
                              Approve Return
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectReturn(selectedReturn.id)}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                            >
                              Reject Return
                            </button>
                          </>
                        )}
                        {selectedReturn.status === "approved" && (
                          <button
                            type="button"
                            onClick={() => handleProcessReturn(selectedReturn.id)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                          >
                            Process Return
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Quick Help Tips */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="88" y1="232" x2="168" y2="232" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M78.7,167A79.87,79.87,0,0,1,48,104.45C47.76,61.09,82.72,25,126.07,24a80,80,0,0,1,51.34,142.9A24.3,24.3,0,0,0,168,186v2a8,8,0,0,1-8,8H96a8,8,0,0,1-8-8v-2A24.11,24.11,0,0,0,78.7,167Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M140,70a36.39,36.39,0,0,1,24,30" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Tips for managing returns</h3>
            <div className="mt-2 text-sm text-blue-700 space-y-1">
              <p>• Review return requests promptly to maintain good retailer relationships</p>
              <p>• Document and photograph returned items during processing</p>
              <p>• Update inventory status after processing approved returns</p>
              <p>• Maintain clear communication with retailers about return status</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;