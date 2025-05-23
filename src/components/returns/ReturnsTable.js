import React, { useState } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import toast from "react-hot-toast";

const ReturnsTable = ({
  returns,
  isLoading,
  onApproveReturn,
  onRejectReturn,
  onProcessReturn,
  onViewDetails
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: "returnDate",
    direction: "desc"
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    dateRange: "all"
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

  const sortedReturns = [...(returns || [])].sort((a, b) => {
    if (sortConfig.direction === "asc") {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(returns.map(r => r.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (returnId) => {
    setSelectedRows(prev =>
      prev.includes(returnId)
        ? prev.filter(id => id !== returnId)
        : [...prev, returnId]
    );
  };

  const handleBulkAction = async (action) => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one return request");
      return;
    }

    try {
      switch (action) {
        case "approve":
          await Promise.all(selectedRows.map(id => onApproveReturn(id)));
          toast.success(`${selectedRows.length} returns approved`);
          break;
        case "reject":
          await Promise.all(selectedRows.map(id => onRejectReturn(id)));
          toast.success(`${selectedRows.length} returns rejected`);
          break;
        default:
          break;
      }
      setSelectedRows([]);
    } catch (error) {
      toast.error("Failed to process bulk action");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    <div className="bg-white shadow rounded-lg">
      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <div className="bg-gray-50 px-4 py-2 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {selectedRows.length} selected
            </span>
            <div className="space-x-2">
              <button
                type="button"
                onClick={() => handleBulkAction("approve")}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
              >
                Approve Selected
              </button>
              <button
                type="button"
                onClick={() => handleBulkAction("reject")}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
              >
                Reject Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="px-4 py-4 border-b border-gray-200">
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
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              id="dateRange"
              name="dateRange"
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                  checked={selectedRows.length === returns.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("returnId")}
              >
                <div className="flex items-center">
                  <span>Return ID</span>
                  {sortConfig.key === "returnId" && (
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
                Retailer Info
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("returnDate")}
              >
                <div className="flex items-center">
                  <span>Return Date</span>
                  {sortConfig.key === "returnDate" && (
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
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedReturns.map((returnItem) => (
              <tr key={returnItem.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    checked={selectedRows.includes(returnItem.id)}
                    onChange={() => handleSelectRow(returnItem.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-primary-600">
                    {returnItem.returnId}
                  </div>
                  <div className="text-sm text-gray-500">
                    Order: {returnItem.orderId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {returnItem.retailer.logo ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={returnItem.retailer.logo}
                          alt={returnItem.retailer.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><polyline points="48 139.59 48 216 208 216 208 139.59" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M54,40H202a8,8,0,0,1,7.69,5.8L224,96H32L46.34,45.8A8,8,0,0,1,54,40Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M96,96v16a32,32,0,0,1-64,0V96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M160,96v16a32,32,0,0,1-64,0V96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M224,96v16a32,32,0,0,1-64,0V96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {returnItem.retailer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {returnItem.retailer.phone}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {returnItem.items.length} items
                  </div>
                  <div className="text-sm text-gray-500">
                    Value: ₹{returnItem.totalValue.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(returnItem.returnDate), "PP")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(returnItem.status)}`}>
                    {returnItem.status.charAt(0).toUpperCase() + returnItem.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onViewDetails(returnItem)}
                    className="text-primary-600 hover:text-primary-900 mr-4"
                  >
                    View Details
                  </button>
                  {returnItem.status === "pending" && (
                    <>
                      <button
                        onClick={() => onApproveReturn(returnItem.id)}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onRejectReturn(returnItem.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {returnItem.status === "approved" && (
                    <button
                      onClick={() => onProcessReturn(returnItem.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Process Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {sortedReturns.length === 0 && (
        <div className="text-center py-12">
          <div className="flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="48" height="48"><rect width="256" height="256" fill="none"/><line x1="88" y1="148" x2="64" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="168 144 168 24 200 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M232,176V116a52,52,0,0,0-52-52H76a52,52,0,0,1,52,52v68h96A8,8,0,0,0,232,176Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M128,224V184H32a8,8,0,0,1-8-8V116A52,52,0,0,1,76,64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No returns found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No return requests match your current filters.
          </p>
        </div>
      )}
    </div>
  );
};

ReturnsTable.propTypes = {
  returns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      returnId: PropTypes.string.isRequired,
      orderId: PropTypes.string.isRequired,
      returnDate: PropTypes.string.isRequired,
      status: PropTypes.oneOf([
        "pending",
        "approved",
        "rejected",
        "processing",
        "completed"
      ]).isRequired,
      retailer: PropTypes.shape({
        name: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        logo: PropTypes.string
      }).isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          quantity: PropTypes.number.isRequired,
          reason: PropTypes.string.isRequired
        })
      ).isRequired,
      totalValue: PropTypes.number.isRequired
    })
  ).isRequired,
  isLoading: PropTypes.bool,
  onApproveReturn: PropTypes.func.isRequired,
  onRejectReturn: PropTypes.func.isRequired,
  onProcessReturn: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired
};

ReturnsTable.defaultProps = {
  isLoading: false
};

export default ReturnsTable;