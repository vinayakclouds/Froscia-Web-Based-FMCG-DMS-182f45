import React, { useState, useEffect, useCallback } from "react";
import InventoryTable from "../../components/inventory/InventoryTable";
import StockTransferForm from "../../components/forms/StockTransferForm";
import { Dialog, Transition } from "@headlessui/react";
import { Tooltip } from "@headlessui/react";
import toast from "react-hot-toast";

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [stockHistory, setStockHistory] = useState([]);
  const [filters, setFilters] = useState({
    warehouse: "all",
    category: "all",
    stockLevel: "all",
    search: ""
  });
  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    expiringItems: 0
  });

  // Fetch inventory data
  const fetchInventory = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample data
      const mockInventory = [
        {
          id: "1",
          name: "Premium Cola 2L",
          sku: "COLA-2L-001",
          category: "beverages",
          currentStock: 1200,
          minStock: 500,
          maxStock: 2000,
          unit: "bottles",
          value: 120000,
          location: "Main Warehouse",
          lastUpdated: "2023-10-15T10:30:00Z",
          status: "active",
          batchNumber: "BT2023101",
          expiryDate: "2024-10-15",
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxDb2xhJTJCYm90dGxlJTJCcHJvZHVjdCUyQmltYWdlfGVufDB8fHx8MTc0Nzk4OTcyMHww&ixlib=rb-4.1.0&q=80&w=1080"
        },
        {
          id: "2",
          name: "Fruit Juice Mango 1L",
          sku: "JUICE-MG-1L",
          category: "beverages",
          currentStock: 300,
          minStock: 400,
          maxStock: 1000,
          unit: "packets",
          value: 45000,
          location: "Main Warehouse",
          lastUpdated: "2023-10-14T15:45:00Z",
          status: "active",
          batchNumber: "BT2023102",
          expiryDate: "2024-06-15",
          image: "https://images.unsplash.com/photo-1601924287811-e34de5d17476?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxNYW5nbyUyQmp1aWNlJTJCcGFja2V0JTJCaW1hZ2V8ZW58MHx8fHwxNzQ3OTg5NzIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
        }
      ];
      
      setInventory(mockInventory);
      
      // Update stats
      setStats({
        totalItems: mockInventory.reduce((sum, item) => sum + item.currentStock, 0),
        totalValue: mockInventory.reduce((sum, item) => sum + item.value, 0),
        lowStockItems: mockInventory.filter(item => item.currentStock <= item.minStock).length,
        expiringItems: mockInventory.filter(item => {
          const expiryDate = new Date(item.expiryDate);
          const threeMonthsFromNow = new Date();
          threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
          return expiryDate <= threeMonthsFromNow;
        }).length
      });

    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error("Failed to load inventory data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Handle stock transfer
  const handleStockTransfer = async (data) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update stock levels logic here
      toast.success("Stock transfer completed successfully!");
      setShowTransferForm(false);
      fetchInventory();
    } catch (error) {
      console.error("Error processing stock transfer:", error);
      toast.error("Failed to process stock transfer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle stock adjustment
  const handleStockAdjust = async (adjustmentData) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInventory(prevInventory =>
        prevInventory.map(item =>
          item.id === selectedItem.id
            ? {
                ...item,
                currentStock:
                  adjustmentData.type === "add"
                    ? item.currentStock + adjustmentData.quantity
                    : item.currentStock - adjustmentData.quantity,
                lastUpdated: new Date().toISOString()
              }
            : item
        )
      );
      
      setIsAdjustModalOpen(false);
      setSelectedItem(null);
      toast.success("Stock adjusted successfully!");
    } catch (error) {
      console.error("Error adjusting stock:", error);
      toast.error("Failed to adjust stock. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch stock history
  const fetchStockHistory = async (itemId) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample history data
      const mockHistory = [
        {
          id: "1",
          date: "2023-10-15T10:30:00Z",
          type: "transfer",
          quantity: 500,
          from: "Main Warehouse",
          to: "Distributor A",
          reference: "TRF001",
          notes: "Regular stock transfer"
        },
        {
          id: "2",
          date: "2023-10-14T15:45:00Z",
          type: "adjustment",
          quantity: 200,
          adjustmentType: "add",
          reference: "ADJ001",
          notes: "Stock count correction"
        }
      ];
      
      setStockHistory(mockHistory);
      setIsHistoryModalOpen(true);
    } catch (error) {
      console.error("Error fetching stock history:", error);
      toast.error("Failed to load stock history. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Inventory Management</h3>
            <p className="mt-1 text-sm text-gray-500">
              Monitor and manage stock levels across warehouses
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setShowTransferForm(!showTransferForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              {showTransferForm ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="160" y1="96" x2="96" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="96" y1="96" x2="160" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  <span className="ml-2">Cancel Transfer</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="216" y1="128" x2="40" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="88" x2="128" y2="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="96 48 128 16 160 48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="168" x2="128" y2="240" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="160 208 128 240 96 208" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  <span className="ml-2">New Transfer</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><polyline points="32.7 76.92 128 129.08 223.3 76.92" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M131.84,25l88,48.18a8,8,0,0,1,4.16,7v95.64a8,8,0,0,1-4.16,7l-88,48.18a8,8,0,0,1-7.68,0l-88-48.18a8,8,0,0,1-4.16-7V80.18a8,8,0,0,1,4.16-7l88-48.18A8,8,0,0,1,131.84,25Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="129.09" x2="128" y2="232" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-800">Total Items</p>
                <p className="text-2xl font-semibold text-purple-900">
                  {stats.totalItems.toLocaleString()}
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

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="132" x2="128" y2="80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="172" r="16"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">Low Stock Items</p>
                <p className="text-2xl font-semibold text-red-900">
                  {stats.lowStockItems}
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
                <p className="text-sm font-medium text-yellow-800">Expiring Soon</p>
                <p className="text-2xl font-semibold text-yellow-900">
                  {stats.expiringItems}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Transfer Form */}
      {showTransferForm && (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <div className="mb-4 pb-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Stock Transfer</h3>
          </div>
          <StockTransferForm onSubmit={handleStockTransfer} />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Inventory
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
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search by name or SKU"
              />
            </div>
          </div>

          <div>
            <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700 mb-1">
              Warehouse
            </label>
            <select
              id="warehouse"
              name="warehouse"
              value={filters.warehouse}
              onChange={(e) => setFilters({...filters, warehouse: e.target.value})}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Warehouses</option>
              <option value="main">Main Warehouse</option>
              <option value="north">North Warehouse</option>
              <option value="south">South Warehouse</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Categories</option>
              <option value="beverages">Beverages</option>
              <option value="snacks">Snacks</option>
              <option value="groceries">Groceries</option>
            </select>
          </div>

          <div>
            <label htmlFor="stockLevel" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Level
            </label>
            <select
              id="stockLevel"
              name="stockLevel"
              value={filters.stockLevel}
              onChange={(e) => setFilters({...filters, stockLevel: e.target.value})}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Levels</option>
              <option value="low">Low Stock</option>
              <option value="normal">Normal</option>
              <option value="high">Excess Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <InventoryTable
        inventory={inventory}
        isLoading={isLoading}
        onAdjust={(item) => {
          setSelectedItem(item);
          setIsAdjustModalOpen(true);
        }}
        onTransfer={(item) => {
          setSelectedItem(item);
          setShowTransferForm(true);
        }}
        onViewHistory={(item) => {
          setSelectedItem(item);
          fetchStockHistory(item.id);
        }}
      />

      {/* Stock Adjustment Modal */}
      <Transition show={isAdjustModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsAdjustModalOpen(false)}
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

            <span className="inline-block h-screen align-middle" aria-hidden="true">
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
                  Adjust Stock Level
                </Dialog.Title>

                <div className="mt-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      handleStockAdjust({
                        type: formData.get("adjustmentType"),
                        quantity: parseInt(formData.get("quantity"), 10),
                        reason: formData.get("reason")
                      });
                    }}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Adjustment Type
                        </label>
                        <select
                          name="adjustmentType"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                          defaultValue="add"
                        >
                          <option value="add">Add Stock</option>
                          <option value="remove">Remove Stock</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          min="1"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reason
                        </label>
                        <textarea
                          name="reason"
                          rows={3}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder="Enter reason for adjustment..."
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsAdjustModalOpen(false)}
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
                      >
                        Confirm Adjustment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Stock History Modal */}
      <Transition show={isHistoryModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsHistoryModalOpen(false)}
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

            <span className="inline-block h-screen align-middle" aria-hidden="true">
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
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Stock Movement History
                </Dialog.Title>

                <div className="mt-4">
                  {selectedItem && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0">
                          {selectedItem.image ? (
                            <img
                              src={selectedItem.image}
                              alt={selectedItem.name}
                              className="h-12 w-12 rounded object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><polyline points="32.7 76.92 128 129.08 223.3 76.92" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M131.84,25l88,48.18a8,8,0,0,1,4.16,7v95.64a8,8,0,0,1-4.16,7l-88,48.18a8,8,0,0,1-7.68,0l-88-48.18a8,8,0,0,1-4.16-7V80.18a8,8,0,0,1,4.16-7l88-48.18A8,8,0,0,1,131.84,25Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="129.09" x2="128" y2="232" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">{selectedItem.name}</h4>
                          <p className="text-sm text-gray-500">SKU: {selectedItem.sku}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <div className="flow-root">
                      <ul className="-my-5 divide-y divide-gray-200">
                        {stockHistory.map((record) => (
                          <li key={record.id} className="py-5">
                            <div className="relative focus-within:ring-2 focus-within:ring-primary-500">
                              <div className="flex justify-between">
                                <div>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    record.type === "transfer"
                                      ? "bg-blue-100 text-blue-800"
                                      : record.adjustmentType === "add"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                  }`}>
                                    {record.type === "transfer"
                                      ? "Transfer"
                                      : record.adjustmentType === "add"
                                        ? "Stock Added"
                                        : "Stock Removed"}
                                  </span>
                                </div>
                                <time className="text-sm text-gray-500">
                                  {new Date(record.date).toLocaleDateString()}
                                </time>
                              </div>
                              <div className="mt-2">
                                <h3 className="text-sm font-medium text-gray-900">
                                  Quantity: {record.quantity}
                                </h3>
                                {record.type === "transfer" && (
                                  <p className="mt-1 text-sm text-gray-500">
                                    From: {record.from} → To: {record.to}
                                  </p>
                                )}
                                {record.notes && (
                                  <p className="mt-1 text-sm text-gray-500">
                                    Notes: {record.notes}
                                  </p>
                                )}
                                <p className="mt-1 text-sm text-gray-500">
                                  Reference: {record.reference}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
                      onClick={() => setIsHistoryModalOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default InventoryManagement;