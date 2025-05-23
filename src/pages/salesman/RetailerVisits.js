import React, { useState, useEffect, useCallback } from "react";
import RetailerVisitList from "../../components/retailers/RetailerVisitList";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { format, addDays } from "date-fns";
import toast from "react-hot-toast";

const RetailerVisits = () => {
  const [visits, setVisits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [showAddVisitModal, setShowAddVisitModal] = useState(false);
  const [retailers, setRetailers] = useState([]);
  const [visitStats, setVisitStats] = useState({
    totalPlanned: 0,
    completed: 0,
    pending: 0,
    skipped: 0
  });

  const [formData, setFormData] = useState({
    retailerId: "",
    visitDate: new Date().toISOString().split("T")[0],
    visitTime: "10:00",
    purpose: "order",
    notes: ""
  });

  // Fetch retailers and visits
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample retailers data
      const mockRetailers = [
        {
          id: "1",
          businessName: "SuperMart Store",
          ownerName: "Rajesh Kumar",
          image: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxTdXBlck1hcnQlMkJzdG9yZSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkxOTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
          address: "123 Main Street, Andheri East",
          phone: "+91 98765 43210",
          lastVisit: "2023-10-01",
          category: "supermarket"
        },
        {
          id: "2",
          businessName: "Quick Shop",
          ownerName: "Priya Patel",
          image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxRdWljayUyQlNob3AlMkJzdG9yZSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkyMjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
          address: "456 Hill Road, Bandra West",
          phone: "+91 87654 32109",
          lastVisit: "2023-10-10",
          category: "general"
        }
      ];
      
      // Sample visits data
      const mockVisits = [
        {
          id: "1",
          retailerId: "1",
          retailer: mockRetailers[0],
          visitDate: "2023-10-18",
          visitTime: "10:30",
          purpose: "order",
          status: "pending",
          notes: "Follow up on previous order"
        },
        {
          id: "2",
          retailerId: "2",
          retailer: mockRetailers[1],
          visitDate: "2023-10-18",
          visitTime: "14:00",
          purpose: "collection",
          status: "completed",
          notes: "Collect payment of ₹12,000",
          completionNotes: "Payment collected successfully"
        }
      ];
      
      setRetailers(mockRetailers);
      setVisits(mockVisits);
      
      // Update stats
      setVisitStats({
        totalPlanned: mockVisits.length,
        completed: mockVisits.filter(v => v.status === "completed").length,
        pending: mockVisits.filter(v => v.status === "pending").length,
        skipped: mockVisits.filter(v => v.status === "skipped").length
      });
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load visit data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddVisit = async () => {
    try {
      if (!formData.retailerId || !formData.visitDate || !formData.visitTime) {
        toast.error("Please fill all required fields");
        return;
      }

      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const selectedRetailer = retailers.find(r => r.id === formData.retailerId);
      
      const newVisit = {
        id: Date.now().toString(),
        retailerId: formData.retailerId,
        retailer: selectedRetailer,
        visitDate: formData.visitDate,
        visitTime: formData.visitTime,
        purpose: formData.purpose,
        status: "pending",
        notes: formData.notes
      };
      
      setVisits(prev => [...prev, newVisit]);
      setShowAddVisitModal(false);
      setFormData({
        retailerId: "",
        visitDate: new Date().toISOString().split("T")[0],
        visitTime: "10:00",
        purpose: "order",
        notes: ""
      });
      
      toast.success("Visit scheduled successfully");
      
      // Refresh stats
      fetchData();
      
    } catch (error) {
      console.error("Error adding visit:", error);
      toast.error("Failed to schedule visit");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteVisit = async (visitId, completionNotes) => {
    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVisits(prev =>
        prev.map(visit =>
          visit.id === visitId
            ? {
                ...visit,
                status: "completed",
                completionNotes,
                completedAt: new Date().toISOString()
              }
            : visit
        )
      );
      
      toast.success("Visit marked as completed");
      fetchData(); // Refresh stats
      
    } catch (error) {
      console.error("Error completing visit:", error);
      toast.error("Failed to update visit status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipVisit = async (visitId, reason) => {
    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVisits(prev =>
        prev.map(visit =>
          visit.id === visitId
            ? {
                ...visit,
                status: "skipped",
                skipReason: reason,
                skippedAt: new Date().toISOString()
              }
            : visit
        )
      );
      
      toast.success("Visit marked as skipped");
      fetchData(); // Refresh stats
      
    } catch (error) {
      console.error("Error skipping visit:", error);
      toast.error("Failed to update visit status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRescheduleVisit = async (visitId, newDate, newTime) => {
    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVisits(prev =>
        prev.map(visit =>
          visit.id === visitId
            ? {
                ...visit,
                visitDate: newDate,
                visitTime: newTime,
                status: "pending"
              }
            : visit
        )
      );
      
      toast.success("Visit rescheduled successfully");
      fetchData(); // Refresh stats
      
    } catch (error) {
      console.error("Error rescheduling visit:", error);
      toast.error("Failed to reschedule visit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="sm:flex sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Retailer Visits</h3>
            <p className="mt-1 text-sm text-gray-500">
              Plan and manage your retailer visits schedule
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setShowAddVisitModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="88" y1="128" x2="168" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="88" x2="128" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              <span className="ml-2">Schedule Visit</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="176" y1="24" x2="176" y2="52" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="80" y1="24" x2="80" y2="52" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="40" y1="88" x2="216" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="84 132 100 124 100 180" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M138.14,132a16,16,0,1,1,26.64,17.63L136,180h32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">Total Planned</p>
                <p className="text-2xl font-semibold text-blue-900">
                  {visitStats.totalPlanned}
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
                <p className="text-sm font-medium text-green-800">Completed</p>
                <p className="text-2xl font-semibold text-green-900">
                  {visitStats.completed}
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
                  {visitStats.pending}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polygon points="96 128 160 88 160 168 96 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="96" y1="88" x2="96" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">Skipped</p>
                <p className="text-2xl font-semibold text-red-900">
                  {visitStats.skipped}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visits List Component */}
      <RetailerVisitList
        visits={visits}
        isLoading={isLoading}
        onComplete={handleCompleteVisit}
        onSkip={handleSkipVisit}
        onReschedule={handleRescheduleVisit}
      />

      {/* Add Visit Modal */}
      <Transition show={showAddVisitModal} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setShowAddVisitModal(false)}
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
                  Schedule New Visit
                </Dialog.Title>

                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="retailerId" className="block text-sm font-medium text-gray-700">
                      Select Retailer *
                    </label>
                    <select
                      id="retailerId"
                      name="retailerId"
                      value={formData.retailerId}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      <option value="">Select a retailer</option>
                      {retailers.map(retailer => (
                        <option key={retailer.id} value={retailer.id}>
                          {retailer.businessName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="visitDate" className="block text-sm font-medium text-gray-700">
                        Visit Date *
                      </label>
                      <input
                        type="date"
                        name="visitDate"
                        id="visitDate"
                        value={formData.visitDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="visitTime" className="block text-sm font-medium text-gray-700">
                        Visit Time *
                      </label>
                      <input
                        type="time"
                        name="visitTime"
                        id="visitTime"
                        value={formData.visitTime}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
                      Visit Purpose
                    </label>
                    <select
                      id="purpose"
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      <option value="order">Order Taking</option>
                      <option value="collection">Payment Collection</option>
                      <option value="introduction">Product Introduction</option>
                      <option value="complaint">Resolve Complaint</option>
                      <option value="feedback">Get Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Enter any additional notes for the visit"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddVisitModal(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddVisit}
                    disabled={isLoading}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="224" y1="128" x2="192" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="195.88" y1="195.88" x2="173.25" y2="173.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="224" x2="128" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="60.12" y1="195.88" x2="82.75" y2="173.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="32" y1="128" x2="64" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="60.12" y1="60.12" x2="82.75" y2="82.75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                        <span className="ml-2">Scheduling...</span>
                      </>
                    ) : (
                      "Schedule Visit"
                    )}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default RetailerVisits;