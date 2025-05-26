```jsx
import React, { useState, useEffect, useCallback } from "react";
import SalesmanTable from "../../components/salesmen/SalesmanTable";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";

const Salesmen = () => {
  const [salesmen, setSalesmen] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSalesman, setSelectedSalesman] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [statsData, setStatsData] = useState({
    totalSalesmen: 0,
    activeSalesmen: 0,
    achievingTarget: 0,
    averagePerformance: 0
  });
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    performanceRange: "all"
  });
  
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    joinDate: "",
    idProof: "",
    status: "active"
  });

  // Fetch salesmen data
  const fetchSalesmen = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample data
      const mockSalesmen = [
        {
          id: "1",
          name: "Rahul Sharma",
          code: "SM001",
          avatar: "https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxQcm9maWxlJTJCcGhvdG8lMkJvZiUyQlJhaHVsJTJCU2hhcm1hfGVufDB8fHx8MTc0Nzk5MTU1Mnww&ixlib=rb-4.1.0&q=80&w=1080",
          phone: "+91 98765 43210",
          email: "rahul.sharma@example.com",
          address: "123 Main Street, Sector 12",
          city: "Mumbai",
          joinDate: "2022-05-15",
          status: "active",
          achievementPercentage: 85,
          targetAmount: 250000,
          currentAmount: 212500,
          retailers: 28,
          lastVisit: "2023-10-14T09:30:00Z",
          visitPlanned: 35,
          visitCompleted: 29,
          collections: 185000,
          pendingCollections: 45000
        },
        {
          id: "2",
          name: "Priya Patel",
          code: "SM002",
          avatar: "https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxQcm9maWxlJTJCcGhvdG8lMkJvZiUyQlByaXlhJTJCUGF0ZWx8ZW58MHx8fHwxNzQ3OTkxNTYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
          phone: "+91 87654 32109",
          email: "priya.patel@example.com",
          address: "456 Park Avenue, Andheri East",
          city: "Mumbai",
          joinDate: "2021-11-10",
          status: "active",
          achievementPercentage: 104,
          targetAmount: 200000,
          currentAmount: 208000,
          retailers: 32,
          lastVisit: "2023-10-15T10:15:00Z",
          visitPlanned: 40,
          visitCompleted: 38,
          collections: 195000,
          pendingCollections: 25000
        },
        {
          id: "3",
          name: "Sanjay Kumar",
          code: "SM003",
          avatar: "https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxQcm9maWxlJTJCcGhvdG8lMkJvZiUyQlNhbmpheSUyQkt1bWFyfGVufDB8fHx8MTc0Nzk5MTU2MXww&ixlib=rb-4.1.0&q=80&w=1080",
          phone: "+91 76543 21098",
          email: "sanjay.kumar@example.com",
          address: "789 Lake View Road, Powai",
          city: "Mumbai",
          joinDate: "2023-02-22",
          status: "inactive",
          achievementPercentage: 62,
          targetAmount: 180000,
          currentAmount: 111600,
          retailers: 22,
          lastVisit: "2023-10-05T14:45:00Z",
          visitPlanned: 30,
          visitCompleted: 18,
          collections: 98000,
          pendingCollections: 35000
        }
      ];
      
      setSalesmen(mockSalesmen);
      
      // Calculate stats
      const activeSalesmenCount = mockSalesmen.filter(s => s.status === "active").length;
      const achievingTargetCount = mockSalesmen.filter(s => s.achievementPercentage >= 80).length;
      const totalPerformance = mockSalesmen.reduce((sum, s) => sum + s.achievementPercentage, 0);
      
      setStatsData({
        totalSalesmen: mockSalesmen.length,
        activeSalesmen: activeSalesmenCount,
        achievingTarget: achievingTargetCount,
        averagePerformance: mockSalesmen.length > 0 ? Math.round(totalPerformance / mockSalesmen.length) : 0
      });
      
    } catch (error) {
      console.error("Error fetching salesmen:", error);
      toast.error("Failed to load salesmen data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalesmen();
  }, [fetchSalesmen]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Filter salesmen based on current filters
  const filteredSalesmen = salesmen.filter(salesman => {
    // Status filter
    if (filters.status !== "all" && salesman.status !== filters.status) {
      return false;
    }
    
    // Search filter
    if (filters.search && !salesman.name.toLowerCase().includes(filters.search.toLowerCase()) && 
        !salesman.code.toLowerCase().includes(filters.search.toLowerCase()) &&
        !salesman.phone.includes(filters.search)) {
      return false;
    }
    
    // Performance filter
    if (filters.performanceRange !== "all") {
      if (filters.performanceRange === "high" && salesman.achievementPercentage < 90) {
        return false;
      } else if (filters.performanceRange === "medium" && (salesman.achievementPercentage < 70 || salesman.achievementPercentage >= 90)) {
        return false;
      } else if (filters.performanceRange === "low" && salesman.achievementPercentage >= 70) {
        return false;
      }
    }
    
    return true;
  });

  // Handle add salesman
  const handleAddSalesman = async () => {
    try {
      setIsLoading(true);
      // Validate form data
      if (!formData.name || !formData.phone || !formData.email) {
        toast.error("Please fill all required fields");
        setIsLoading(false);
        return;
      }
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSalesman = {
        id: `${salesmen.length + 1}`,
        code: formData.code || `SM00${salesmen.length + 1}`,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        joinDate: formData.joinDate || new Date().toISOString().split("T")[0],
        status: formData.status,
        achievementPercentage: 0,
        targetAmount: 0,
        currentAmount: 0,
        retailers: 0,
        lastVisit: null,
        visitPlanned: 0,
        visitCompleted: 0,
        collections: 0,
        pendingCollections: 0
      };
      
      setSalesmen([...salesmen, newSalesman]);
      setIsAddModalOpen(false);
      setFormData({
        name: "",
        code: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        joinDate: "",
        idProof: "",
        status: "active"
      });
      
      fetchSalesmen(); // Refresh stats
      toast.success("Salesman added successfully");
      
    } catch (error) {
      console.error("Error adding salesman:", error);
      toast.error("Failed to add salesman");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit salesman
  const handleEditSalesman = async () => {
    try {
      setIsLoading(true);
      
      // Validate form data
      if (!formData.name || !formData.phone || !formData.email) {
        toast.error("Please fill all required fields");
        setIsLoading(false);
        return;
      }
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSalesmen(salesmen.map(s => 
        s.id === selectedSalesman.id
          ? { ...s, 
              name: formData.name,
              phone: formData.phone,
              email: formData.email,
              address: formData.address,
              city: formData.city,
              status: formData.status
            }
          : s
      ));
      
      setIsEditModalOpen(false);
      setSelectedSalesman(null);
      fetchSalesmen(); // Refresh stats
      toast.success("Salesman updated successfully");
      
    } catch (error) {
      console.error("Error editing salesman:", error);
      toast.error("Failed to update salesman");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete salesman
  const handleDeleteSalesman = async () => {
    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSalesmen(salesmen.filter(s => s.id !== selectedSalesman.id));
      setIsDeleteModalOpen(false);
      setSelectedSalesman(null);
      fetchSalesmen(); // Refresh stats
      toast.success("Salesman deleted successfully");
      
    } catch (error) {
      console.error("Error deleting salesman:", error);
      toast.error("Failed to delete salesman");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (id) => {
    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSalesmen(salesmen.map(s => 
        s.id === id
          ? { ...s, status: s.status === "active" ? "inactive" : "active" }
          : s
      ));
      
      fetchSalesmen(); // Refresh stats
      toast.success("Salesman status updated successfully");
      
    } catch (error) {
      console.error("Error updating salesman status:", error);
      toast.error("Failed to update salesman status");
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
            <h3 className="text-lg font-medium text-gray-900">Salesman Management</h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage your field sales force and track their performance
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="88" y1="128" x2="168" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="88" x2="128" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              <span className="ml-2">Add Salesman</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><circle cx="80" cy="172" r="28" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="80" cy="60" r="28" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="176" cy="172" r="28" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="176" cy="60" r="28" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M32,224a60,60,0,0,1,96,0,60,60,0,0,1,96,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M32,112a60,60,0,0,1,96,0h0a60,60,0,0,1,96,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">Total Salesmen</p>
                <p className="text-2xl font-semibold text-blue-900">
                  {statsData.totalSalesmen}
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
                <p className="text-sm font-medium text-green-800">Active Salesmen</p>
                <p className="text-2xl font-semibold text-green-900">
                  {statsData.activeSalesmen}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="96" y1="224" x2="160" y2="224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="184" x2="128" y2="224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M58,128H48A32,32,0,0,1,16,96V80a8,8,0,0,1,8-8H56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M198,128h10a32,32,0,0,0,32-32V80a8,8,0,0,0-8-8H200" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M56,48H200v63.1c0,39.7-31.75,72.6-71.45,72.9A72,72,0,0,1,56,112Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-800">Achieving Target</p>
                <p className="text-2xl font-semibold text-purple-900">
                  {statsData.achievingTarget}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><polyline points="224 208 32 208 32 48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="224 96 160 152 96 104 32 160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-amber-800">Avg. Performance</p>
                <p className="text-2xl font-semibold text-amber-900">
                  {statsData.averagePerformance}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Salesmen
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
                onChange={handleFilterChange}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search by name, code, or phone"
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
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label htmlFor="performanceRange" className="block text-sm font-medium text-gray-700 mb-1">
              Performance
            </label>
            <select
              id="performanceRange"
              name="performanceRange"
              value={filters.performanceRange}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Performance</option>
              <option value="high">High (≥90%)</option>
              <option value="medium">Medium (70-89%)</option>
              <option value="low">Low (&lt;70%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Salesmen Table */}
      <SalesmanTable
        salesmen={filteredSalesmen}
        isLoading={isLoading}
        onEdit={(salesman) => {
          setSelectedSalesman(salesman);
          setFormData({
            name: salesman.name,
            code: salesman.code,
            phone: salesman.phone,
            email: salesman.email,
            address: salesman.address || "",
            city: salesman.city || "",
            joinDate: salesman.joinDate,
            status: salesman.status
          });
          setIsEditModalOpen(true);
        }}
        onDelete={(salesman) => {
          setSelectedSalesman(salesman);
          setIsDeleteModalOpen(true);
        }}
        onViewDetails={(salesman) => {
          setSelectedSalesman(salesman);
          setIsViewModalOpen(true);
        }}
        onToggleStatus={handleToggleStatus}
      />

      {/* Add Salesman Modal */}
      <Transition show={isAddModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsAddModalOpen(false)}
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
                  Add New Salesman
                </Dialog.Title>
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                        Employee Code
                      </label>
                      <input
                        type="text"
                        name="code"
                        id="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        placeholder="Auto-generated if empty"
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
                        Email Address *
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

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      name="address"
                      id="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700">
                        Join Date
                      </label>
                      <input
                        type="date"
                        name="joinDate"
                        id="joinDate"
                        value={formData.joinDate}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="idProof" className="block text-sm font-medium text-gray-700">
                      ID Proof
                    </label>
                    <input
                      type="file"
                      name="idProof"
                      id="idProof"
                      onChange={handleInputChange}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
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
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddSalesman}
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
                      "Add Salesman"
                    )}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Salesman Modal */}
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
                  Edit Salesman
                </Dialog.Title>
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                        Employee Code
                      </label>
                      <input
                        type="text"
                        name="code"
                        id="code"
                        value={formData.code}
                        disabled
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow```