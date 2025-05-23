import React, { useState } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import toast from "react-hot-toast";

const DispatchTable = ({
  orders,
  isLoading,
  onUpdateDeliveryStatus,
  onViewDetails,
  onPrintInvoice,
  onPrintDeliveryNote
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: "orderDate",
    direction: "desc"
  });

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc"
    });
  };

  const sortedOrders = [...(orders || [])].sort((a, b) => {
    if (sortConfig.direction === "asc") {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "ready_for_dispatch":
        return "bg-blue-100 text-blue-800";
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleQuickStatusUpdate = async (orderId, newStatus) => {
    try {
      await onUpdateDeliveryStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus.replace("_", " ")}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update order status");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="animate-pulse">
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("orderNumber")}
              >
                <div className="flex items-center">
                  <span>Order Details</span>
                  {sortConfig.key === "orderNumber" && (
                    <span className="ml-2">
                      {sortConfig.direction === "asc" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><path d="M216,112V56a8,8,0,0,0-8-8H48a8,8,0,0,0-8,8v56c0,96,88,120,88,120S216,208,216,112Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="201.97 171.78 128 120 54.03 171.78" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><path d="M216,112V56a8,8,0,0,0-8-8H48a8,8,0,0,0-8,8v56c0,96,88,120,88,120S216,208,216,112Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="201.97 171.78 128 120 54.03 171.78" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("retailerName")}
              >
                <div className="flex items-center">
                  <span>Retailer</span>
                  {sortConfig.key === "retailerName" && (
                    <span className="ml-2">
                      {sortConfig.direction === "asc" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><path d="M216,112V56a8,8,0,0,0-8-8H48a8,8,0,0,0-8,8v56c0,96,88,120,88,120S216,208,216,112Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="201.97 171.78 128 120 54.03 171.78" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><path d="M216,112V56a8,8,0,0,0-8-8H48a8,8,0,0,0-8,8v56c0,96,88,120,88,120S216,208,216,112Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="201.97 171.78 128 120 54.03 171.78" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delivery Info
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {order.items[0]?.image ? (
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={order.items[0].image}
                          alt={order.items[0].name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><rect x="32" y="48" width="192" height="160" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M168,88a40,40,0,0,1-80,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.orderNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(order.orderDate), "PPP")}
                      </div>
                      <div className="text-sm text-gray-500">
                        ₹{order.totalAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      {order.retailer.logo ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={order.retailer.logo}
                          alt={order.retailer.name}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><line x1="16" y1="216" x2="240" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="224 216 224 76 176 76 176 40 80 40 80 112 32 112 32 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="76" x2="136" y2="76" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="112" x2="136" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="112" x2="188" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="68" y1="148" x2="84" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="148" x2="136" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="148" x2="188" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M148,216V176a4,4,0,0,0-4-4H112a4,4,0,0,0-4,4v40Z"/></svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {order.retailer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.retailer.phone}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{order.shippingAddress.street}</div>
                  <div className="text-sm text-gray-500">
                    {order.shippingAddress.city}, {order.shippingAddress.pincode}
                  </div>
                  {order.expectedDelivery && (
                    <div className="text-xs text-gray-500">
                      Expected: {format(new Date(order.expectedDelivery), "PP")}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                    {order.status.replace("_", " ").charAt(0).toUpperCase() + order.status.replace("_", " ").slice(1)}
                  </span>
                  {order.lastUpdated && (
                    <div className="text-xs text-gray-500 mt-1">
                      Updated: {format(new Date(order.lastUpdated), "PP")}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => onViewDetails(order)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onPrintInvoice(order.id)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Invoice
                    </button>
                    <button
                      onClick={() => onPrintDeliveryNote(order.id)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Delivery Note
                    </button>
                    <div className="relative inline-block text-left">
                      <select
                        value={order.status}
                        onChange={(e) => handleQuickStatusUpdate(order.id, e.target.value)}
                        className="block w-full pl-3 pr-10 py-1 text-xs border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
                      >
                        <option value="pending">Pending</option>
                        <option value="ready_for_dispatch">Ready for Dispatch</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="48" height="48"><rect width="256" height="256" fill="none"/><line x1="88" y1="148" x2="64" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="168 144 168 24 200 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M232,176V116a52,52,0,0,0-52-52H76a52,52,0,0,1,52,52v68h96A8,8,0,0,0,232,176Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M128,224V184H32a8,8,0,0,1-8-8V116A52,52,0,0,1,76,64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders to dispatch</h3>
          <p className="mt-1 text-sm text-gray-500">
            New orders will appear here when they are ready for dispatch.
          </p>
        </div>
      )}
    </div>
  );
};

DispatchTable.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      orderNumber: PropTypes.string.isRequired,
      orderDate: PropTypes.string.isRequired,
      expectedDelivery: PropTypes.string,
      status: PropTypes.string.isRequired,
      lastUpdated: PropTypes.string,
      totalAmount: PropTypes.number.isRequired,
      retailer: PropTypes.shape({
        name: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        logo: PropTypes.string
      }).isRequired,
      shippingAddress: PropTypes.shape({
        street: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        pincode: PropTypes.string.isRequired
      }).isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          image: PropTypes.string
        })
      ).isRequired
    })
  ).isRequired,
  isLoading: PropTypes.bool,
  onUpdateDeliveryStatus: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onPrintInvoice: PropTypes.func.isRequired,
  onPrintDeliveryNote: PropTypes.func.isRequired
};

DispatchTable.defaultProps = {
  isLoading: false
};

export default DispatchTable;