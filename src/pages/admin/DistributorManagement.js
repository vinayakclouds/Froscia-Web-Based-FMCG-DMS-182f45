import React, { useState, useEffect, useCallback } from "react";
import DistributorTable from "../../components/distributors/DistributorTable";
import DistributorForm from "../../components/forms/DistributorForm";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";

const DistributorManagement = () => {
  const [distributors, setDistributors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    region: "all",
    status: "all",
    search: ""
  });
  const [importModal, setImportModal] = useState(false);
  const [exportOptions, setExportOptions] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [territoryMap, setTerritoryMap] = useState(false);

  // Fetch distributors
  const fetchDistributors = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample data
      const mockDistributors = [
        {
          id: "1",
          name: "Global Distribution Co.",
          code: "DST001",
          ownerName: "Rajesh Kumar",
          phone: "+919876543210",
          email: "global.dist@example.com",
          type: "distributor",
          region: "North",
          address: "123 Main Street, Delhi",
          creditLimit: 500000,
          outstandingAmount: 250000,
          overdueDays: 0,
          status: "active",
          logo: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxEaXN0cmlidXRpb24lMkJjb21wYW55JTJCbG9nb3xlbnwwfHx8fDE3NDc5ODkxMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
        },
        {
          id: "2",
          name: "Super Stock Enterprises",
          code: "SST001",
          ownerName: "Priya Sharma",
          phone: "+919988776655",
          email: "super.stock@example.com",
          type: "superstockist",
          region: "South",
          address: "456 Market Road, Bangalore",
          creditLimit: 1000000,
          outstandingAmount: 750000,
          overdueDays: 5,
          status: "active",
          logo: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxTdXBlcnN0b2NraXN0JTJCY29tcGFueSUyQmxvZ298ZW58MHx8fHwxNzQ3OTg5MTM1fDA&ixlib=rb-4.1.0&q=80&w=1080"
        }
      ];
      
      setDistributors(mockDistributors);
    } catch (error) {
      console.error("Error fetching distributors:", error);
      toast.error("Failed to load distributors. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDistributors();
  }, [fetchDistributors]);

  // Handle distributor creation
  const handleAddDistributor = async (data) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newDistributor = {
        id: String(Math.floor(Math.random() * 10000)),
        ...data
      };
      
      setDistributors(prevDistributors => [newDistributor, ...prevDistributors]);
      setShowAddForm(false);
      toast.success("Distributor created successfully!");
    } catch (error) {
      console.error("Error creating distributor:", error);
      toast.error("Failed to create distributor. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle distributor update
  const handleUpdateDistributor = async (data) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setDistributors(prevDistributors =>
        prevDistributors.map(distributor =>
          distributor.id === selectedDistributor.id ? { ...distributor, ...data } : distributor
        )
      );
      
      setIsEditModalOpen(false);
      setSelectedDistributor(null);
      toast.success("Distributor updated successfully!");
    } catch (error) {
      console.error("Error updating distributor:", error);
      toast.error("Failed to update distributor. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle distributor deletion
  const handleDeleteDistributor = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDistributors(prevDistributors => 
        prevDistributors.filter(distributor => distributor.id !== selectedDistributor.id)
      );
      
      setIsDeleteModalOpen(false);
      setSelectedDistributor(null);
      toast.success("Distributor deleted successfully!");
    } catch (error) {
      console.error("Error deleting distributor:", error);
      toast.error("Failed to delete distributor. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (distributor) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDistributors(prevDistributors =>
        prevDistributors.map(d =>
          d.id === distributor.id ? { ...d, status: d.status === "active" ? "inactive" : "active" } : d
        )
      );
      
      toast.success(`Distributor ${distributor.status === "active" ? "deactivated" : "activated"} successfully!`);
    } catch (error) {
      console.error("Error changing distributor status:", error);
      toast.error("Failed to change distributor status. Please try again.");
    }
  };

  // Handle import file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Handle import submission
  const handleImportSubmit = async () => {
    try {
      if (!selectedFile) {
        toast.error("Please select a file to import.");
        return;
      }

      toast.loading("Processing file...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.dismiss();
      
      setImportModal(false);
      setSelectedFile(null);
      toast.success("Distributors imported successfully!");
      fetchDistributors();
    } catch (error) {
      console.error("Error importing distributors:", error);
      toast.error("Failed to import distributors. Please check your file format.");
    }
  };

  // Handle export
  const handleExport = async (format) => {
    try {
      toast.loading(`Generating ${format.toUpperCase()} file...`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.dismiss();
      
      toast.success(`Distributors exported as ${format.toUpperCase()} successfully!`);
      setExportOptions(false);
    } catch (error) {
      console.error("Error exporting distributors:", error);
      toast.error("Failed to export distributors. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Distributor Management</h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage your distributors and superstockists network
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:flex sm:space-x-3">
            <div className="relative inline-block text-left">
              <button
                onClick={() => setExportOptions(!exportOptions)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><path d="M180,104h20a8,8,0,0,1,8,8v96a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V112a8,8,0,0,1,8-8H76" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="88 64 128 24 168 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="24" x2="128" y2="136" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                <span className="ml-2">Export</span>
              </button>
              
              {exportOptions && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      onClick={() => handleExport("excel")}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><polyline points="148 32 148 92 208 92" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M48,108V40a8,8,0,0,1,8-8h96l56,56v20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="148 208 120 208 120 152" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="44" y1="152" x2="84" y2="208" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="84" y1="152" x2="44" y2="208" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M207.9,153.6s-29.43-7.78-31.8,11,38.43,10.12,35.78,30.72c-2.47,19.16-31.78,11-31.78,11" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                      <span className="ml-2">Export to Excel</span>
                    </button>
                    <button
                      onClick={() => handleExport("csv")}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><polyline points="148 32 148 92 208 92" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M48,108V40a8,8,0,0,1,8-8h96l56,56v20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M76,200.87A22.12,22.12,0,0,1,60,208c-13.26,0-24-12.54-24-28s10.74-28,24-28a22.12,22.12,0,0,1,16,7.13" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M139.9,153.6s-29.43-7.78-31.8,11,38.43,10.12,35.78,30.72c-2.47,19.16-31.78,11-31.78,11" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="172 152 192 208 212 152" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                      <span className="ml-2">Export to CSV</span>
                    </button>
                    <button
                      onClick={() => handleExport("pdf")}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><polyline points="220 152 188 152 188 208" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="212" y1="184" x2="188" y2="184" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M44,192H60a20,20,0,0,0,0-40H44v56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M112,152v56h16a28,28,0,0,0,0-56Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="148 32 148 92 208 92" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M48,108V40a8,8,0,0,1,8-8h96l56,56v20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                      <span className="ml-2">Export to PDF</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setImportModal(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="128" y1="144" x2="128" y2="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="216 144 216 208 40 208 40 144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="88 72 128 32 168 72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              <span className="ml-2">Import</span>
            </button>
            
            <button
              onClick={() => setTerritoryMap(!territoryMap)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="64" r="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="96" x2="128" y2="176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M172,139.75c35.44,6.37,60,20.21,60,36.25,0,22.09-46.56,40-104,40S24,198.09,24,176c0-16,24.56-29.88,60-36.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              <span className="ml-2">Territory Map</span>
            </button>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              {showAddForm ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="160" y1="96" x2="96" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="96" y1="96" x2="160" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  <span className="ml-2">Cancel</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="88" y1="128" x2="168" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="88" x2="128" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  <span className="ml-2">Add Distributor</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Add Distributor Form */}
      {showAddForm && (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <div className="mb-4 pb-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Add New Distributor</h3>
          </div>
          <DistributorForm onSubmit={handleAddDistributor} />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Distributors
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
                placeholder="Search by name or code"
              />
            </div>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Types</option>
              <option value="distributor">Distributor</option>
              <option value="superstockist">Superstockist</option>
            </select>
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </label>
            <select
              id="region"
              name="region"
              value={filters.region}
              onChange={(e) => setFilters({...filters, region: e.target.value})}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Regions</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
              <option value="Central">Central</option>
            </select>
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
        </div>
      </div>

      {/* Territory Map View */}
      {territoryMap && (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg">
            {/* Replace with actual map implementation */}
            <div className="flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1577086664693-894d8405334a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxUZXJyaXRvcnklMkJtYXAlMkJzaG93aW5nJTJCZGlzdHJpYnV0b3IlMkJsb2NhdGlvbnN8ZW58MHx8fHwxNzQ3OTg5MTc5fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Territory map showing distributor locations" />
            </div>
          </div>
        </div>
      )}

      {/* Distributors Table */}
      <DistributorTable
        distributors={distributors}
        isLoading={isLoading}
        onEdit={(distributor) => {
          setSelectedDistributor(distributor);
          setIsEditModalOpen(true);
        }}
        onDelete={(distributor) => {
          setSelectedDistributor(distributor);
          setIsDeleteModalOpen(true);
        }}
        onStatusChange={handleStatusChange}
      />

      {/* Edit Modal */}
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
              <div className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Edit Distributor
                </Dialog.Title>
                <div className="mt-4">
                  {selectedDistributor && (
                    <DistributorForm
                      distributor={selectedDistributor}
                      onSubmit={handleUpdateDistributor}
                      isLoading={isLoading}
                    />
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition show={isDeleteModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsDeleteModalOpen(false)}
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
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="132" x2="128" y2="80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="172" r="16"/></svg>
                </div>
                
                <Dialog.Title
                  as="h3"
                  className="mt-4 text-lg font-medium leading-6 text-gray-900 text-center"
                >
                  Delete Distributor
                </Dialog.Title>
                
                <div className="mt-2">
                  <p className="text-sm text-gray-500 text-center">
                    Are you sure you want to delete {selectedDistributor?.name}? This action cannot be undone.
                  </p>
                </div>

                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                    onClick={handleDeleteDistributor}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Import Modal */}
      <Transition show={importModal} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setImportModal(false)}
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
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Import Distributors
                </Dialog.Title>
                
                <div className="mt-4">
                  <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <div className="space-y-2">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="128" y1="144" x2="128" y2="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="216 144 216 208 40 208 40 144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="88 72 128 32 168 72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                      </div>
                      <div className="text-sm">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            onChange={handleFileSelect}
                            className="sr-only"
                          />
                        </label>
                        <p className="text-gray-500">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        CSV, Excel up to 10MB
                      </p>
                    </div>
                    {selectedFile && (
                      <div className="mt-4 p-2 bg-blue-50 rounded flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><polyline points="148 32 148 92 208 92" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M48,108V40a8,8,0,0,1,8-8h96l56,56v20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M32,152v56H48a28,28,0,0,0,0-56Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M220,200.87A22.12,22.12,0,0,1,204,208c-13.26,0-24-12.54-24-28s10.74-28,24-28a22.12,22.12,0,0,1,16,7.13" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><ellipse cx="128" cy="180" rx="24" ry="28" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                        <span className="ml-2 text-sm text-blue-700">
                          {selectedFile.name}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <a
                      href="#"
                      download
                      className="text-sm text-primary-600 hover:text-primary-500 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><line x1="128" y1="144" x2="128" y2="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="216 144 216 208 40 208 40 144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="168 104 128 144 88 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                      <span className="ml-2">Download sample template</span>
                    </a>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
                      onClick={() => setImportModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
                      onClick={handleImportSubmit}
                      disabled={!selectedFile}
                    >
                      Import
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

export default DistributorManagement;