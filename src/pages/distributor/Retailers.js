```jsx
import React, { useState, useEffect, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import RetailerTable from "../../components/retailers/RetailerTable";
import toast from "react-hot-toast";

const Retailers = () => {
  const [retailers, setRetailers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    area: "all",
    search: ""
  });
  const [stats, setStats] = useState({
    totalRetailers: 0,
    activeRetailers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    phone: "",
    email: "",
    category: "general",
    area: "",
    address: "",
    gstNumber: "",
    creditLimit: "",
    status: "active"
  });

  // Fetch retailers
  const fetchRetailers = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample data
      const mockRetailers = [
        {
          id: "1",
          businessName: "SuperMart Store",
          ownerName: "Rajesh Kumar",
          shopImage: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxTdXBlck1hcnQlMkJzdG9yZSUyQmZyb250fGVufDB8fHx8MTc0Nzk5MTcxNnww&ixlib=rb-4.1.0&q=80&w=1080",
          phone: "+91 98765 43210",
          email: "rajesh@supermart.com",
          category: "supermarket",
          area: "Andheri East",
          address: "123, Market Road, Mumbai - 400069",
          gstNumber: "27AABCU9603R1ZX",
          creditLimit: 100000,
          currentDue: 25000,
          totalOrders: 156,
          lastOrder: "2023-10-15T10:30:00Z",
          averageOrderValue: 15000,
          status: "active",
          assignedSalesman: {
            id: "SLS001",
            name: "John Doe"
          }
        },
        {
          id: "2",
          businessName: "Quick Stop",
          ownerName: "Priya Patel",
          shopImage: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxRdWljayUyQlN0b3AlMkJzdG9yZSUyQmZyb250fGVufDB8fHx8MTc0Nzk5MTcyMXww&ixlib=rb-4.1.0&q=80&w=1080",
          phone: "+91 87654 32109",
          email: "priya@quickstop.com",
          category: "convenience",
          area: "Bandra West",
          address: "45, Hill Road, Mumbai - 400050",
          gstNumber: "27AADCQ9603R1ZX",
          creditLimit: 50000,
          currentDue: 35000,
          totalOrders: 89,
          lastOrder: "2023-10-14T15:45:00Z",
          averageOrderValue: 8000,
          status: "inactive",
          assignedSalesman: {
            id: "SLS002",
            name: "Sarah Johnson"
          }
        }
      ];
      
      setRetailers(mockRetailers);
      
      // Update stats
      const activeRetailers = mockRetailers.filter(r => r.status === "active");
      const totalOrders = mockRetailers.reduce((sum, r) => sum + r.totalOrders, 0);
      const totalRevenue = mockRetailers.reduce((sum, r) => sum + (r.averageOrderValue * r.totalOrders), 0);
      
      setStats({
        totalRetailers: mockRetailers.length,
        activeRetailers: activeRetailers.length,
        totalOrders: totalOrders,
        totalRevenue: totalRevenue
      });

    } catch (error) {
      console.error("Error fetching retailers:", error);
      toast.error("Failed to load retailers data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRetailers();
  }, [fetchRetailers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddRetailer = async () => {
    try {
      setIsLoading(true);
      
      // Validate form data
      if (!formData.businessName || !formData.phone || !formData.area) {
        toast.error("Please fill all required fields");
        return;
      }
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRetailer = {
        id: `${retailers.length + 1}`,
        ...formData,
        totalOrders: 0,
        currentDue: 0,
        averageOrderValue: 0,
        lastOrder: null
      };
      
      setRetailers([...retailers, newRetailer]);
      setShowAddModal(false);
      setFormData({
        businessName: "",
        ownerName: "",
        phone: "",
        email: "",
        category: "general",
        area: "",
        address: "",
        gstNumber: "",
        creditLimit: "",
        status: "active"
      });
      
      toast.success("Retailer added successfully");
      fetchRetailers(); // Refresh stats
      
    } catch (error) {
      console.error("Error adding retailer:", error);
      toast.error("Failed to add retailer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRetailer = async () => {
    try {
      setIsLoading(true);
      
      // Validate form data
      if (!formData.businessName || !formData.phone || !formData.area) {
        toast.error("Please fill all required fields");
        return;
      }
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRetailers(retailers.map(r => 
        r.id === selectedRetailer.id ? { ...r, ...formData } : r
      ));
      
      setIsEditModalOpen(false);
      setSelectedRetailer(null);
      toast.success("Retailer updated successfully");
      fetchRetailers(); // Refresh stats
      
    } catch (error) {
      console.error("Error updating retailer:", error);
      toast.error("Failed to update retailer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRetailer = async () => {
    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRetailers(retailers.filter(r => r.id !== selectedRetailer.id));
      setIsDeleteModalOpen(false);
      setSelectedRetailer(null);
      toast.success("Retailer deleted successfully");
      fetchRetailers(); // Refresh stats
      
    } catch (error) {
      console.error("Error deleting retailer:", error);
      toast.error("Failed to delete retailer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (retailerId) => {
    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRetailers(retailers.map(r => 
        r.id === retailerId
          ? { ...r, status: r.status === "active" ? "inactive" : "active" }
          : r
      ));
      
      toast.success("Retailer status updated successfully");
      fetchRetailers(); // Refresh stats
      
    } catch (error) {
      console.error("Error updating retailer status:", error);
      toast.error("Failed to update retailer status");
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
            <h3 className="text-lg font-medium text-gray-900">Retailer Management</h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage your retail partners and track their performance
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="88" y1="128" x2="168" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="88" x2="128" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              <span className="ml-2">Add Retailer</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="16" y1="216" x2="240" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="224 216 224 76 176 76 176 40 80 40 80 112 32 112 32 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="76" x2="136" y2="76" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="112" x2="136" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="112" x2="188" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="68" y1="148" x2="84" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="148" x2="136" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="148" x2="188" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M148,216V176a4,4,0,0,0-4-4H112a4,4,0,0,0-4,4v40Z"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">Total Retailers</p>
                <p className="text-2xl font-semibold text-blue-900">
                  {stats.totalRetailers}
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
                <p className="text-sm font-medium text-green-800">Active Retailers</p>
                <p className="text-2xl font-semibold text-green-900">
                  {stats.activeRetailers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><path d="M188,184H91.17a16,16,0,0,1-15.74-13.14L48.73,24H24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="92" cy="204" r="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="188" cy="204" r="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M70.55,144H196.1a16,16,0,0,0,15.74-13.14L224,64H56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-800">Total Orders</p>
                <p className="text-2xl font-semibold text-purple-900">
                  {stats.totalOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="128" y1="72" x2="128" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="168" x2="128" y2="184" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M104,168h36a20,20,0,0,0,0-40H116a20,20,0,0,1,0-40h36" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-amber-800">Total Revenue</p>
                <p className="text-2xl font-semibold text-amber-900">
                  ₹{stats.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Retailers
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
                placeholder="Search by name or phone"
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
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
              <option value="general">General Store</option>
              <option value="supermarket">Supermarket</option>
              <option value="convenience">Convenience Store</option>
              <option value="medical">Medical Store</option>
              <option value="restaurant">Restaurant</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
              Area
            </label>
            <select
              id="area"
              name="area"
              value={filters.area}
              onChange={(e) => setFilters({...filters, area: e.target.value})}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Areas</option>
              <option value="Andheri East">Andheri East</option>
              <option value="Andheri West">Andheri West</option>
              <option value="Bandra West">Bandra West</option>
              <option value="Bandra East">Bandra East</option>
            </select>
          </div>
        </div>
      </div>

      {/* Retailers Table */}
      <RetailerTable
        retailers={retailers}
        isLoading={isLoading}
        onEdit={(retailer) => {
          setSelectedRetailer(retailer);
          setFormData({
            businessName: retailer.businessName,
            ownerName: retailer.ownerName,
            phone: retailer.phone,
            email: retailer.email || "",
            category: retailer.category,
            area: retailer.area,
            address: retailer.address,
            gstNumber: retailer.gstNumber || "",
            creditLimit: retailer.creditLimit,
            status: retailer.status
          });
          setIsEditModalOpen(true);
        }}
        onDelete={(retailer) => {
          setSelectedRetailer(retailer);
          setIsDeleteModalOpen(true);
        }}
        onStatusChange={handleStatusChange}
      />

      {/* Add Retailer Modal */}
      <Transition show={showAddModal} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setShowAddModal(false)}
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
                  Add New Retailer
                </Dialog.Title>

                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        id="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
                        Owner Name
                      </label>
                      <input
                        type="text"
                        name="ownerName"
                        id="ownerName"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number *
                      </label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        name="category"
                        id="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                        <option value="general">General Store</option>
                        <option value="supermarket">Supermarket</option>
                        <option value="convenience">Convenience Store</option>
                        <option value="medical">Medical Store</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                        Area *
                      </label>
                      <select
                        name="area"
                        id="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                        <option value="">Select Area</option>
                        <option value="Andheri East">Andheri East</option>
                        <option value="Andheri West">Andheri West</option>
                        <option value="Bandra West">Bandra West</option>
                        <option value="Bandra East">Bandra East</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      name="address"
                      id="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
                        GST Number
                      </label>
                      <input
                        type="text"
                        name="gstNumber"
                        id="gstNumber"
                        value={formData.gstNumber}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="creditLimit" className="block text-sm font-medium text-gray-700">
                        Credit Limit
                      </label>
                      <input
                        type="number"
                        name="creditLimit"
                        id="creditLimit"
                        value={formData.creditLimit}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      name="status"
                      id="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddRetailer}
                    disabled={isLoading}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="224" y1="128" x2="192" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="195.88" y1="195.88" x2="173.25" y2="173.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="224" x2="128" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="60.12" y1="195.88" x2="82.75" y2="173.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="32" y1="128" x2="64" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="60.12" y1="60.12" x2="82.75" y2="82.75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                        <span className="ml-2">Processing...</span>
                      </>
                    ) : (
                      "Add Retailer"
                    )}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Retailer Modal */}
      <Transition show={isEditModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsEditModalOpen(false)}
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
                  Edit Retailer
                </Dialog.Title>

                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        id="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
                        Owner Name
                      </label>
                      <input
                        type="text"
                        name="ownerName"
                        id="ownerName"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number *
                      </label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-```