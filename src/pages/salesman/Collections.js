import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    paymentMode: "cash",
    referenceNumber: "",
    bankName: "",
    chequeDate: "",
    notes: ""
  });

  const [stats, setStats] = useState({
    totalOutstanding: 0,
    todayCollections: 0,
    pendingCollections: 0,
    overdueCollections: 0
  });

  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    search: ""
  });

  // Fetch collections data
  const fetchCollections = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample data
      const mockCollections = [
        {
          id: "1",
          retailer: {
            id: "R1",
            name: "SuperMart Store",
            image: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxTdXBlck1hcnQlMkJzdG9yZSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkxOTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
            address: "123 Market Road, Mumbai",
            phone: "+91 98765 43210"
          },
          totalDue: 45000,
          currentDue: 15000,
          overdueDue: 30000,
          creditLimit: 100000,
          lastPayment: {
            amount: 25000,
            date: "2023-10-01",
            mode: "cheque"
          },
          paymentHistory: [
            {
              id: "P1",
              amount: 25000,
              date: "2023-10-01",
              mode: "cheque",
              referenceNumber: "CHQ001",
              status: "completed"
            }
          ]
        },
        {
          id: "2",
          retailer: {
            id: "R2",
            name: "Quick Shop",
            image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxRdWljayUyQlNob3AlMkJzdG9yZSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkyMjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
            address: "456 Hill Road, Mumbai",
            phone: "+91 87654 32109"
          },
          totalDue: 28000,
          currentDue: 28000,
          overdueDue: 0,
          creditLimit: 75000,
          lastPayment: {
            amount: 12000,
            date: "2023-09-25",
            mode: "cash"
          },
          paymentHistory: [
            {
              id: "P2",
              amount: 12000,
              date: "2023-09-25",
              mode: "cash",
              status: "completed"
            }
          ]
        }
      ];
      
      setCollections(mockCollections);
      
      // Update stats
      const statsData = {
        totalOutstanding: mockCollections.reduce((sum, c) => sum + c.totalDue, 0),
        todayCollections: mockCollections.reduce((sum, c) => {
          const todayPayments = c.paymentHistory.filter(p => 
            new Date(p.date).toDateString() === new Date().toDateString()
          );
          return sum + todayPayments.reduce((pSum, p) => pSum + p.amount, 0);
        }, 0),
        pendingCollections: mockCollections.reduce((sum, c) => sum + c.currentDue, 0),
        overdueCollections: mockCollections.reduce((sum, c) => sum + c.overdueDue, 0)
      };
      
      setStats(statsData);
      
    } catch (error) {
      console.error("Error fetching collections:", error);
      toast.error("Failed to load collections data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const handleRecordPayment = (retailer) => {
    setSelectedRetailer(retailer);
    setPaymentForm({
      amount: "",
      paymentMode: "cash",
      referenceNumber: "",
      bankName: "",
      chequeDate: "",
      notes: ""
    });
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!paymentForm.amount || parseFloat(paymentForm.amount) <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    if (parseFloat(paymentForm.amount) > selectedRetailer.totalDue) {
      toast.error("Payment amount cannot exceed total due amount");
      return;
    }

    if (paymentForm.paymentMode === "cheque" &&
        (!paymentForm.bankName || !paymentForm.chequeDate)) {
      toast.error("Please fill all cheque details");
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const paymentData = {
        retailerId: selectedRetailer.id,
        ...paymentForm,
        amount: parseFloat(paymentForm.amount),
        date: new Date().toISOString()
      };
      
      // Update collections data
      setCollections(prev => 
        prev.map(collection => 
          collection.id === selectedRetailer.id
            ? {
                ...collection,
                totalDue: collection.totalDue - paymentData.amount,
                currentDue: collection.currentDue - paymentData.amount,
                lastPayment: {
                  amount: paymentData.amount,
                  date: paymentData.date,
                  mode: paymentData.paymentMode
                },
                paymentHistory: [
                  {
                    id: Date.now().toString(),
                    ...paymentData,
                    status: "completed"
                  },
                  ...collection.paymentHistory
                ]
              }
            : collection
        )
      );
      
      setShowPaymentModal(false);
      toast.success("Payment recorded successfully");
      
    } catch (error) {
      console.error("Error recording payment:", error);
      toast.error("Failed to record payment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getCreditUtilizationColor = (totalDue, creditLimit) => {
    const utilization = (totalDue / creditLimit) * 100;
    if (utilization >= 90) return "bg-red-100 text-red-800";
    if (utilization >= 75) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900">Collections</h3>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage retailer payments and outstanding dues
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-primary-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="128" y1="72" x2="128" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="168" x2="128" y2="184" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M104,168h36a20,20,0,0,0,0-40H116a20,20,0,0,1,0-40h36" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-primary-900">Total Outstanding</p>
                <p className="text-2xl font-semibold text-primary-700">
                  ₹{stats.totalOutstanding.toLocaleString()}
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
                <p className="text-sm font-medium text-green-900">Today's Collections</p>
                <p className="text-2xl font-semibold text-green-700">
                  ₹{stats.todayCollections.toLocaleString()}
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
                <p className="text-sm font-medium text-yellow-900">Pending Collections</p>
                <p className="text-2xl font-semibold text-yellow-700">
                  ₹{stats.pendingCollections.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><path d="M142.41,40.22l87.46,151.87C236,202.79,228.08,216,215.46,216H40.54C27.92,216,20,202.79,26.13,192.09L113.59,40.22C119.89,29.26,136.11,29.26,142.41,40.22Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-900">Overdue</p>
                <p className="text-2xl font-semibold text-red-700">
                  ₹{stats.overdueCollections.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search Retailers
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="80" y1="112" x2="144" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="112" cy="112" r="80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="168.57" y1="168.57" x2="224" y2="224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="112" y1="80" x2="112" y2="144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                value={filters.search}
                onChange={handleFilterChange}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search by retailer name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Payment Status
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">
              Date Range
            </label>
            <select
              id="dateRange"
              name="dateRange"
              value={filters.dateRange}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Collections List */}
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {isLoading ? (
          <div className="animate-pulse p-6">
            <div className="space-y-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="48" height="48"><rect width="256" height="256" fill="none"/><line x1="80" y1="100" x2="176" y2="100" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="80" y1="140" x2="176" y2="140" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M32,208V56a8,8,0,0,1,8-8H216a8,8,0,0,1,8,8V208l-32-16-32,16-32-16L96,208,64,192Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No collections found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No payment collections match your current filters.
            </p>
          </div>
        ) : (
          collections.map(collection => (
            <div key={collection.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    {collection.retailer.image ? (
                      <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={collection.retailer.image}
                        alt={collection.retailer.name}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="16" y1="216" x2="240" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="224 216 224 76 176 76 176 40 80 40 80 112 32 112 32 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="76" x2="136" y2="76" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="112" x2="136" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="112" x2="188" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="68" y1="148" x2="84" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="148" x2="136" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="148" x2="188" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M148,216V176a4,4,0,0,0-4-4H112a4,4,0,0,0-4,4v40Z"/></svg>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">
                      {collection.retailer.name}
                    </h4>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><rect x="64" y="24" width="128" height="208" rx="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="64" y1="64" x2="192" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="64" y1="192" x2="192" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                      <span className="ml-2">{collection.retailer.phone}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRecordPayment(collection)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="88" y1="128" x2="168" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="88" x2="128" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  <span className="ml-2">Record Payment</span>
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-500">Total Due</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    ₹{collection.totalDue.toLocaleString()}
                  </p>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getCreditUtilizationColor(collection.totalDue, collection.creditLimit)
                    }`}>
                      {Math.round((collection.totalDue / collection.creditLimit) * 100)}% of credit limit
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-500">Current Due</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    ₹{collection.currentDue.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-500">Overdue</p>
                  <p className="mt-1 text-lg font-semibold text-red-600">
                    ₹{collection.overdueDue.toLocaleString()}
                  </p>
                </div>
              </div>

              {collection.lastPayment && (
                <div className="mt-4 text-sm text-gray-500">
                  Last Payment: ₹{collection.lastPayment.amount.toLocaleString()} ({collection.lastPayment.mode}) on {format(new Date(collection.lastPayment.date), "PP")}
                </div>
              )}

              {collection.paymentHistory.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Payment History</h5>
                  <div className="space-y-2">
                    {collection.paymentHistory.slice(0, 3).map(payment => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-2"
                      >
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900">
                            ₹{payment.amount.toLocaleString()}
                          </span>
                          <span className="ml-2 text-gray-500">
                            via {payment.mode}
                          </span>
                        </div>
                        <div className="text-gray-500">
                          {format(new Date(payment.date), "PP")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Record Payment Modal */}
      <Transition show={showPaymentModal} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setShowPaymentModal(false)}
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
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Record Payment
                </Dialog.Title>

                {selectedRetailer && (
                  <form onSubmit={handlePaymentSubmit} className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                          Payment Amount *
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">₹</span>
                          </div>
                          <input
                            type="number"
                            name="amount"
                            id="amount"
                            min="0"
                            max={selectedRetailer.totalDue}
                            value={paymentForm.amount}
                            onChange={handleInputChange}
                            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-700">
                          Payment Mode *
                        </label>
                        <select
                          id="paymentMode"
                          name="paymentMode"
                          value={paymentForm.paymentMode}
                          onChange={handleInputChange}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        >
                          <option value="cash">Cash</option>
                          <option value="cheque">Cheque</option>
                          <option value="upi">UPI</option>
                          <option value="bank_transfer">Bank Transfer</option>
                        </select>
                      </div>

                      {paymentForm.paymentMode !== "cash" && (
                        <div>
                          <label htmlFor="referenceNumber" className="block text-sm font-medium text-gray-700">
                            Reference Number
                          </label>
                          <input
                            type="text"
                            name="referenceNumber"
                            id="referenceNumber"
                            value={paymentForm.referenceNumber}
                            onChange={handleInputChange}
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      )}

                      {paymentForm.paymentMode === "cheque" && (
                        <>
                          <div>
                            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                              Bank Name *
                            </label>
                            <input
                              type="text"
                              name="bankName"
                              id="bankName"
                              value={paymentForm.bankName}
                              onChange={handleInputChange}
                              className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>

                          <div>
                            <label htmlFor="chequeDate" className="block text-sm font-medium text-gray-700">
                              Cheque Date *
                            </label>
                            <input
                              type="date"
                              name="chequeDate"
                              id="chequeDate"
                              value={paymentForm.chequeDate}
                              onChange={handleInputChange}
                              min={new Date().toISOString().split("T")[0]}
                              className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </>
                      )}

                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                          Notes
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows={3}
                          value={paymentForm.notes}
                          onChange={handleInputChange}
                          className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          placeholder="Add any additional notes about this payment"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowPaymentModal(false)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Record Payment
                      </button>
                    </div>
                  </form>
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
            <h3 className="text-sm font-medium text-blue-800">Collection Tips</h3>
            <div className="mt-2 text-sm text-blue-700 space-y-1">
              <p>• Always verify the payment amount and mode before recording</p>
              <p>• For cheque payments, ensure proper documentation of cheque details</p>
              <p>• Keep track of overdue payments and follow up regularly</p>
              <p>• Maintain clear communication with retailers about payment schedules</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collections;