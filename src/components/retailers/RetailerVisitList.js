```jsx
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";

const RetailerVisitList = ({ initialVisits = [], onVisitStatusChange }) => {
  const [visits, setVisits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    date: "all",
    search: ""
  });
  const [visitForm, setVisitForm] = useState({
    retailerId: "",
    retailerName: "",
    scheduledDate: new Date().toISOString().split("T")[0],
    scheduledTime: "10:00",
    purpose: "order",
    note: "",
    status: "pending"
  });
  const [retailers, setRetailers] = useState([]);

  // Fetch retailers (for dropdown selection when adding visits)
  const fetchRetailers = useCallback(async () => {
    try {
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Sample data
      const mockRetailers = [
        {
          id: "1",
          businessName: "SuperMart Store",
          address: "123, Market Road, Mumbai - 400069",
          area: "Andheri East",
          lastVisit: "2023-10-01T10:30:00Z"
        },
        {
          id: "2",
          businessName: "Quick Stop",
          address: "45, Hill Road, Mumbai - 400050",
          area: "Bandra West",
          lastVisit: "2023-10-10T15:45:00Z"
        },
        {
          id: "3",
          businessName: "Family Grocers",
          address: "78, Market Complex, Dadar",
          area: "Dadar",
          lastVisit: "2023-09-25T11:20:00Z"
        }
      ];
      
      setRetailers(mockRetailers);
    } catch (error) {
      console.error("Error fetching retailers:", error);
      toast.error("Failed to load retailers");
    }
  }, []);

  // Fetch visits data
  const fetchVisits = useCallback(async () => {
    setIsLoading(true);
    try {
      // If we have initialVisits props, use them
      if (initialVisits && initialVisits.length > 0) {
        setVisits(initialVisits);
        setIsLoading(false);
        return;
      }
      
      // Otherwise, fetch from simulated API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample data
      const mockVisits = [
        {
          id: "1",
          retailer: {
            id: "1",
            name: "SuperMart Store",
            image: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxTdXBlck1hcnQlMkJzdG9yZSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkxOTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
            address: "123, Market Road, Mumbai - 400069",
            area: "Andheri East",
            phone: "+91 98765 43210"
          },
          scheduledDate: "2023-10-18",
          scheduledTime: "10:30",
          purpose: "order",
          note: "Follow up on previous order and collect payment",
          status: "completed",
          completedAt: "2023-10-18T10:45:00Z",
          feedback: "Order placed for ₹15,000. Payment of ₹8,000 collected."
        },
        {
          id: "2",
          retailer: {
            id: "2",
            name: "Quick Stop",
            image: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxRdWljayUyQlN0b3AlMkJzdG9yZSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkxOTcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
            address: "45, Hill Road, Mumbai - 400050",
            area: "Bandra West",
            phone: "+91 87654 32109"
          },
          scheduledDate: "2023-10-18",
          scheduledTime: "14:00",
          purpose: "collection",
          note: "Collect pending payment of ₹12,000",
          status: "pending"
        },
        {
          id: "3",
          retailer: {
            id: "3",
            name: "Family Grocers",
            image: "https://images.unsplash.com/photo-1523951778169-4cb35545bfa2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxGYW1pbHklMkJHcm9jZXJzJTJCc3RvcmUlMkJsb2dvfGVufDB8fHx8MTc0Nzk5MTk3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
            address: "78, Market Complex, Dadar",
            area: "Dadar",
            phone: "+91 76543 21098"
          },
          scheduledDate: "2023-10-19",
          scheduledTime: "11:00",
          purpose: "introduction",
          note: "Introduce new product line and offer samples",
          status: "pending"
        },
        {
          id: "4",
          retailer: {
            id: "1",
            name: "SuperMart Store",
            image: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxTdXBlck1hcnQlMkJzdG9yZSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkxOTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
            address: "123, Market Road, Mumbai - 400069",
            area: "Andheri East",
            phone: "+91 98765 43210"
          },
          scheduledDate: "2023-10-25",
          scheduledTime: "16:30",
          purpose: "feedback",
          note: "Follow up on product performance and collect market feedback",
          status: "pending"
        }
      ];
      
      setVisits(mockVisits);
    } catch (error) {
      console.error("Error fetching visits:", error);
      toast.error("Failed to load visit schedule");
    } finally {
      setIsLoading(false);
    }
  }, [initialVisits]);

  useEffect(() => {
    fetchVisits();
    fetchRetailers();
  }, [fetchVisits, fetchRetailers]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Filter visits based on current filters
  const filteredVisits = visits.filter(visit => {
    // Status filter
    if (filters.status !== "all" && visit.status !== filters.status) {
      return false;
    }
    
    // Date filter
    if (filters.date === "today") {
      if (visit.scheduledDate !== new Date().toISOString().split("T")[0]) {
        return false;
      }
    } else if (filters.date === "tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (visit.scheduledDate !== tomorrow.toISOString().split("T")[0]) {
        return false;
      }
    } else if (filters.date === "this_week") {
      const today = new Date();
      const visitDate = new Date(visit.scheduledDate);
      const diffTime = visitDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 0 || diffDays > 7) {
        return false;
      }
    }
    
    // Search filter
    if (filters.search && !visit.retailer.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleViewVisit = (visit) => {
    setSelectedVisit(visit);
    setIsViewModalOpen(true);
  };

  const handleAddVisitClick = () => {
    setVisitForm({
      retailerId: "",
      retailerName: "",
      scheduledDate: new Date().toISOString().split("T")[0],
      scheduledTime: "10:00",
      purpose: "order",
      note: "",
      status: "pending"
    });
    setIsAddModalOpen(true);
  };

  const handleEditVisitClick = (visit) => {
    setSelectedVisit(visit);
    setVisitForm({
      retailerId: visit.retailer.id,
      retailerName: visit.retailer.name,
      scheduledDate: visit.scheduledDate,
      scheduledTime: visit.scheduledTime,
      purpose: visit.purpose,
      note: visit.note,
      status: visit.status
    });
    setIsEditModalOpen(true);
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setVisitForm(prev => ({ ...prev, [name]: value }));
    
    // When selecting a retailer from dropdown, update retailer name too
    if (name === "retailerId") {
      const selectedRetailer = retailers.find(r => r.id === value);
      if (selectedRetailer) {
        setVisitForm(prev => ({ ...prev, retailerName: selectedRetailer.businessName }));
      }
    }
  };

  const handleAddVisit = async () => {
    try {
      if (!visitForm.retailerId || !visitForm.scheduledDate || !visitForm.scheduledTime) {
        toast.error("Please fill all required fields");
        return;
      }
      
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const selectedRetailer = retailers.find(r => r.id === visitForm.retailerId);
      
      const newVisit = {
        id: Date.now().toString(),
        retailer: {
          id: visitForm.retailerId,
          name: visitForm.retailerName,
          address: selectedRetailer?.address || "",
          area: selectedRetailer?.area || "",
          phone: ""
        },
        scheduledDate: visitForm.scheduledDate,
        scheduledTime: visitForm.scheduledTime,
        purpose: visitForm.purpose,
        note: visitForm.note,
        status: "pending"
      };
      
      setVisits(prev => [...prev, newVisit]);
      setIsAddModalOpen(false);
      toast.success("Visit scheduled successfully");
    } catch (error) {
      console.error("Error adding visit:", error);
      toast.error("Failed to schedule visit");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateVisit = async () => {
    try {
      if (!visitForm.scheduledDate || !visitForm.scheduledTime) {
        toast.error("Please fill all required fields");
        return;
      }
      
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setVisits(prev => prev.map(visit => 
        visit.id === selectedVisit.id 
          ? { 
              ...visit, 
              scheduledDate: visitForm.scheduledDate,
              scheduledTime: visitForm.scheduledTime,
              purpose: visitForm.purpose,
              note: visitForm.note,
              status: visitForm.status
            }
          : visit
      ));
      
      setIsEditModalOpen(false);
      toast.success("Visit updated successfully");
    } catch (error) {
      console.error("Error updating visit:", error);
      toast.error("Failed to update visit");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVisit = async (visitId) => {
    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setVisits(prev => prev.filter(visit => visit.id !== visitId));
      setIsViewModalOpen(false);
      setSelectedVisit(null);
      toast.success("Visit removed from schedule");
    } catch (error) {
      console.error("Error deleting visit:", error);
      toast.error("Failed to remove visit");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsCompleted = async (visitId, feedback = "") => {
    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedVisits = visits.map(visit => 
        visit.id === visitId 
          ? { 
              ...visit, 
              status: "completed", 
              completedAt: new Date().toISOString(),
              feedback: feedback || visit.feedback
            }
          : visit
      );
      
      setVisits(updatedVisits);
      
      // Call the parent component callback if provided
      if (onVisitStatusChange) {
        const updatedVisit = updatedVisits.find(v => v.id === visitId);
        onVisitStatusChange(updatedVisit);
      }
      
      setIsViewModalOpen(false);
      setSelectedVisit(null);
      toast.success("Visit marked as completed");
    } catch (error) {
      console.error("Error marking visit as completed:", error);
      toast.error("Failed to update visit status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsCancelled = async (visitId, reason = "") => {
    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedVisits = visits.map(visit => 
        visit.id === visitId 
          ? { 
              ...visit, 
              status: "cancelled", 
              feedback: reason || "Visit cancelled"
            }
          : visit
      );
      
      setVisits(updatedVisits);
      
      // Call the parent component callback if provided
      if (onVisitStatusChange) {
        const updatedVisit = updatedVisits.find(v => v.id === visitId);
        onVisitStatusChange(updatedVisit);
      }
      
      setIsViewModalOpen(false);
      setSelectedVisit(null);
      toast.success("Visit marked as cancelled");
    } catch (error) {
      console.error("Error cancelling visit:", error);
      toast.error("Failed to cancel visit");
    } finally {
      setIsLoading(false);
    }
  };

  // Get appropriate badge color based on visit status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "rescheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get appropriate icon based on visit purpose
  const getPurposeIcon = (purpose) => {
    switch (purpose) {
      case "order":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><path d="M20,32H40L76.75,164.28A16,16,0,0,0,92.16,176H191a16,16,0,0,0,15.42-11.72L232,72H51.11" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="88" cy="220" r="20"/><circle cx="192" cy="220" r="20"/></svg>
        );
      case "collection":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="56" y1="128" x2="136" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M184,208H60a36,36,0,0,0,36-36V84a44,44,0,0,1,72-33.95" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
        );
      case "introduction":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><path d="M84.27,171.73l-55.09-20.3a7.92,7.92,0,0,1,0-14.86l55.09-20.3,20.3-55.09a7.92,7.92,0,0,1,14.86,0l20.3,55.09,55.09,20.3a7.92,7.92,0,0,1,0,14.86l-55.09,20.3-20.3,55.09a7.92,7.92,0,0,1-14.86,0Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="176" y1="16" x2="176" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="224" y1="72" x2="224" y2="104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="152" y1="40" x2="200" y2="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="208" y1="88" x2="240" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
        );
      case "feedback":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="96" y1="100" x2="160" y2="100" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="96" y1="140" x2="160" y2="140" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M105.07,192l16,28a8,8,0,0,0,13.9,0l16-28H216a8,8,0,0,0,8-8V56a8,8,0,0,0-8-8H40a8,8,0,0,0-8,8V184a8,8,0,0,0,8,8Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
        );
      case "complaint":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><path d="M142.41,40.22l87.46,151.87C236,202.79,228.08,216,215.46,216H40.54C27.92,216,20,202.79,26.13,192.09L113.59,40.22C119.89,29.26,136.11,29.26,142.41,40.22Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="16" y1="216" x2="240" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="224 216 224 76 176 76 176 40 80 40 80 112 32 112 32 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="76" x2="136" y2="76" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="112" x2="136" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="112" x2="188" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="68" y1="148" x2="84" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="148" x2="136" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="148" x2="188" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M148,216V176a4,4,0,0,0-4-4H112a4,4,0,0,0-4,4v40Z"/></svg>
        );
    }
  };

  // Group visits by date for better organization
  const groupVisitsByDate = (visits) => {
    const groups = {};
    
    visits.forEach(visit => {
      const date = visit.scheduledDate;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(visit);
    });
    
    // Sort visits within each group by time
    Object.keys(groups).forEach(date => {
      groups[date].sort((a, b) => {
        return a.scheduledTime.localeCompare(b.scheduledTime);
      });
    });
    
    return groups;
  };

  const groupedVisits = groupVisitsByDate(filteredVisits);
  
  // Sort dates in ascending order
  const sortedDates = Object.keys(groupedVisits).sort();

  return (
    <div className="space-y-6">
      {/* Filters and Add Button */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="sm:flex sm:items-center sm:justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Retailer Visits</h3>
          <div className="mt-3 sm:mt-0">
            <button
              type="button"
              onClick={handleAddVisitClick}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="88" y1="128" x2="168" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="88" x2="128" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              <span className="ml-2">Schedule Visit</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                onChange={handleFilterChange}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search by retailer name"
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
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
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
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="this_week">This Week</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visit List */}
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {isLoading ? (
          <div className="animate-pulse p-6 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredVisits.length === 0 ? (
          <div className="p-6 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="48" height="48"><rect width="256" height="256" fill="none"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="176" y1="24" x2="176" y2="52" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="80" y1="24" x2="80" y2="52" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="40" y1="88" x2="216" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900">No visits scheduled</h3>
            <p className="mt-1 text-sm text-gray-500">
              Schedule your first retailer visit by clicking on the "Schedule Visit" button.
            </p>
          </div>
        ) : (
          <div>
            {sortedDates.map(date => (
              <div key={date} className="divide-y divide-gray-100">
                <div className="px-6 py-3 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-900">
                    {date === new Date().toISOString().split("T")[0] ? (
                      <span className="flex items-center">
                        Today
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {format(new Date(date), "MMMM d, yyyy")}
                        </span>
                      </span>
                    ) : (
                      format(new Date(date), "EEEE, MMMM d, yyyy")
                    )}
                  </h4>
                </div>
                {groupedVisits[date].map((visit) => (
                  <div 
                    key={visit.id} 
                    className="p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewVisit(visit)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {visit.retailer.image ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={visit.retailer.image}
                              alt={visit.retailer.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="16" y1="216" x2="240" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="224 216 224 76 176 76 176 40 80 40 80 112 32 112 32 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="76" x2="136" y2="76" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="112" x2="136" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="112" x2="188" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="68" y1="148" x2="84" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="148" x2="136" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="148" x2="188" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M148,216V176a4,4,0,0,0-4-4H112a4,4,0,0,0-4,4v40Z"/></svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <h5 className="text-sm font-medium text-gray-900">{visit.retailer.name}</h5>
                          <div className="mt-1 flex items-center text-xs text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="14" height="14"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="48" r="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="208" r="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                            <span className="ml-1.5 truncate">{visit.retailer.address}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(visit.status)}`}>
                            {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-end text-xs text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="14" height="14"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="128 72 128 128 184 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                          <span className="ml-1.5">{visit.scheduledTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <div className="flex-shrink-0">
                        {getPurposeIcon(visit.purpose)}
                      </div>
                      <div className="ml-2 text-sm text-gray-700">
                        {visit.purpose.charAt(0).toUpperCase() + visit.purpose.slice(1)}
                      </div>
                      {visit.note && (
                        <div className="ml-4 text-sm text-gray-500 truncate flex-1">
                          {visit.note}
                        </div>
                      )}
                    </div>
                    {visit.feedback && visit.status === "completed" && (
                      <div className="mt-2 text-sm text-green-600">
                        {visit.feedback}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Visit Modal */}
      <Transition show={isViewModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsViewModalOpen(false)}
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
              {selectedVisit && (
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Visit Details
                  </Dialog.Title>

                  <div className="mt-4 space-y-4">
                    {/* Retailer info */}
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {selectedVisit.retailer.image ? (
                          <img
                            className="h-12 w-12 rounded-full object-cover"
                            src={selectedVisit.retailer.image}
                            alt={selectedVisit.retailer.name}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="16" y1="216" x2="240" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="224 216 224 76 176 76 176 40 80 40 80 112 32 112 32 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="76" x2="136" y2="76" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="112" x2="136" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="112" x2="188" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="68" y1="148" x2="84" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="148" x2="136" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="148" x2="188" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M148,216V176a4,4,0,0,0-4-4H112a4,4,0,0,0-4,4v40Z"/></svg>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-base font-medium text-gray-900">{selectedVisit.retailer.name}</h4>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="14" height="14"><rect width="256" height="256" fill="none"/><line x1="152" y1="56" x2="200" y2="104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="200" y1="56" x2="152" y2="104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M156.39,153.34a8,8,0,0,1,7.59-.69l47.16,21.13a8,8,0,0,1,4.8,8.3A48.33,48.33,0,0,1,168,224,136,136,0,0,1,32,88,48.33,48.33,0,0,1,73.92,40.06a8,8,0,0,1,8.3,4.8l21.13,47.2a8,8,0,0,1-.66,7.53L81.32,125a7.93,7.93,0,0,0-.54,7.81c8.27,16.93,25.77,34.22,42.75,42.41a7.92,7.92,0,0,0,7.83-.59Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                          <span className="ml-1.5">{selectedVisit.retailer.phone || "No phone number"}</span>
                        </div>
                      </div>
                      <div className="ml-auto">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedVisit.status)}`}>
                          {selectedVisit.status.charAt(0).toUpperCase() + selectedVisit.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Visit details */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500">Date</p>
                          <p className="mt-1 text-sm text-gray-900">
                            {format(new Date(selectedVisit.scheduledDate), "MMMM d, yyyy")}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Time</p>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedVisit.scheduledTime}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Purpose</p>
                          <div className="mt-1 flex items-center text-sm text-gray-900">
                            <div className="flex-shrink-0">
                              {getPurposeIcon(selectedVisit.purpose)}
                            </div>
                            <span className="ml-1.5">
                              {selectedVisit.purpose.charAt(0).toUpperCase() + selectedVisit.purpose.slice(1)}
                            </span>
                          </div>
                        </div>
                        {selectedVisit.completedAt && (
                          <div>
                            <p className="text-xs font-medium text-gray-500">Completed At</p>
                            <p className="mt-1 text-sm text-gray-900">
                              {format(new Date(selectedVisit.completedAt), "PPp")}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {selectedVisit.note && (
                        <div className="mt-4">
                          <p className="text-xs font-medium text-gray-500">Note```