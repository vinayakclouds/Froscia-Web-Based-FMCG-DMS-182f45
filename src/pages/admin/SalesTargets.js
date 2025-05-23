import React, { useState, useEffect, useCallback } from "react";
import TargetTable from "../../components/targets/TargetTable";
import TargetForm from "../../components/forms/TargetForm";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";

const SalesTargets = () => {
  const [targets, setTargets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    period: "all",
    status: "all",
    search: ""
  });
  const [stats, setStats] = useState({
    totalTargets: 0,
    activeTargets: 0,
    achievedTargets: 0,
    averageAchievement: 0
  });

  // Fetch targets
  const fetchTargets = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample data
      const mockTargets = [
        {
          id: "1",
          name: "John Smith",
          code: "SLS001",
          type: "salesperson",
          image: "https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxTYWxlc3BlcnNvbiUyQnByb2ZpbGUlMkJwaG90b3xlbnwwfHx8fDE3NDc5OTAyMTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
          period: {
            start: "2023-10-01",
            end: "2023-10-31"
          },
          targetAmount: 250000,
          achievedAmount: 225000,
          status: "In Progress"
        },
        {
          id: "2",
          name: "Global Distribution Co.",
          code: "DST001",
          type: "distributor",
          image: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxEaXN0cmlidXRvciUyQmNvbXBhbnklMkJsb2dvfGVufDB8fHx8MTc0Nzk5MDIxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
          period: {
            start: "2023-10-01",
            end: "2023-12-31"
          },
          targetAmount: 1500000,
          achievedAmount: 900000,
          status: "In Progress"
        },
        {
          id: "3",
          name: "Sarah Johnson",
          code: "SLS002",
          type: "salesperson",
          image: "https://images.unsplash.com/photo-1445633883498-7f9922d37a3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxGZW1hbGUlMkJzYWxlc3BlcnNvbiUyQnByb2ZpbGUlMkJwaG90b3xlbnwwfHx8fDE3NDc5OTAyOTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
          period: {
            start: "2023-09-01",
            end: "2023-09-30"
          },
          targetAmount: 200000,
          achievedAmount: 210000,
          status: "Completed"
        }
      ];
      
      setTargets(mockTargets);
      
      // Update stats
      const activeTargets = mockTargets.filter(target => target.status === "In Progress");
      const achievedTargets = mockTargets.filter(target => 
        (target.achievedAmount / target.targetAmount) >= 1
      );
      const totalAchievementPercentage = mockTargets.reduce((sum, target) => 
        sum + ((target.achievedAmount / target.targetAmount) * 100), 0
      );
      
      setStats({
        totalTargets: mockTargets.length,
        activeTargets: activeTargets.length,
        achievedTargets: achievedTargets.length,
        averageAchievement: totalAchievementPercentage / mockTargets.length
      });

    } catch (error) {
      console.error("Error fetching targets:", error);
      toast.error("Failed to load targets. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTargets();
  }, [fetchTargets]);

  // Handle target creation
  const handleAddTarget = async (data) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newTarget = {
        id: String(Math.floor(Math.random() * 10000)),
        ...data,
        // Convert form data to match the target structure
        name: data.assignedTo[0] === "1" ? "John Smith" : "Global Distribution Co.",
        code: data.assignedTo[0] === "1" ? "SLS001" : "DST001",
        type: data.assigneeType,
        image: data.assigneeType === "salesperson" 
          ? "https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxTYWxlc3BlcnNvbiUyQnByb2ZpbGUlMkJwaG90b3xlbnwwfHx8fDE3NDc5OTAyMTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
          : "https://images.unsplash.com/photo-1531973576160-7125cd663d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxEaXN0cmlidXRvciUyQmNvbXBhbnklMkJsb2dvfGVufDB8fHx8MTc0Nzk5MDIxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
        period: {
          start: data.startDate.toISOString().split("T")[0],
          end: data.endDate.toISOString().split("T")[0]
        },
        targetAmount: Number(data.targetValue),
        achievedAmount: 0,
        status: "Not Started"
      };
      
      setTargets(prevTargets => [newTarget, ...prevTargets]);
      setShowAddForm(false);
      toast.success("Target created successfully!");
    } catch (error) {
      console.error("Error creating target:", error);
      toast.error("Failed to create target. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle target update
  const handleUpdateTarget = async (data) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTargets(prevTargets =>
        prevTargets.map(target =>
          target.id === selectedTarget.id 
            ? { 
                ...target,
                targetAmount: Number(data.targetValue),
                period: {
                  start: data.startDate.toISOString().split("T")[0],
                  end: data.endDate.toISOString().split("T")[0]
                },
                status: data.status ? "In Progress" : "On Hold"
              } 
            : target
        )
      );
      
      setIsEditModalOpen(false);
      setSelectedTarget(null);
      toast.success("Target updated successfully!");
      fetchTargets(); // Refresh stats
    } catch (error) {
      console.error("Error updating target:", error);
      toast.error("Failed to update target. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle target deletion
  const handleDeleteTarget = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTargets(prevTargets => 
        prevTargets.filter(target => target.id !== selectedTarget.id)
      );
      
      setIsDeleteModalOpen(false);
      setSelectedTarget(null);
      toast.success("Target deleted successfully!");
      fetchTargets(); // Refresh stats
    } catch (error) {
      console.error("Error deleting target:", error);
      toast.error("Failed to delete target. Please try again.");
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
            <h3 className="text-lg font-medium text-gray-900">Sales Target Management</h3>
            <p className="mt-1 text-sm text-gray-500">
              Set and track sales targets for salesmen and distributors
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
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
                  <span className="ml-2">New Target</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="128" y1="128" x2="224" y2="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M195.88,60.12A95.92,95.92,0,1,0,218,94.56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M161.94,94.06a48,48,0,1,0,13.11,43.46" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-800">Total Targets</p>
                <p className="text-2xl font-semibold text-purple-900">
                  {stats.totalTargets}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="176" y1="24" x2="176" y2="52" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="80" y1="24" x2="80" y2="52" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="40" y1="88" x2="216" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="104" y1="152" x2="152" y2="152" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">Active Targets</p>
                <p className="text-2xl font-semibold text-blue-900">
                  {stats.activeTargets}
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
                <p className="text-sm font-medium text-green-800">Achieved Targets</p>
                <p className="text-2xl font-semibold text-green-900">
                  {stats.achievedTargets}
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
                <p className="text-sm font-medium text-amber-800">Avg. Achievement</p>
                <p className="text-2xl font-semibold text-amber-900">
                  {stats.averageAchievement.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Target Form */}
      {showAddForm && (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <div className="mb-4 pb-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Create New Target</h3>
          </div>
          <TargetForm onSubmit={handleAddTarget} isLoading={isLoading} />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Targets
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
              Target Type
            </label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Types</option>
              <option value="salesperson">Salesperson</option>
              <option value="distributor">Distributor</option>
            </select>
          </div>

          <div>
            <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
              Period
            </label>
            <select
              id="period"
              name="period"
              value={filters.period}
              onChange={(e) => setFilters({...filters, period: e.target.value})}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Periods</option>
              <option value="current">Current Month</option>
              <option value="previous">Previous Month</option>
              <option value="quarter">Current Quarter</option>
              <option value="year">Current Year</option>
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
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Targets Table */}
      <TargetTable
        targets={targets}
        isLoading={isLoading}
        onEdit={(target) => {
          setSelectedTarget(target);
          setIsEditModalOpen(true);
        }}
        onDelete={(target) => {
          setSelectedTarget(target);
          setIsDeleteModalOpen(true);
        }}
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
                  Edit Target
                </Dialog.Title>
                <div className="mt-4">
                  {selectedTarget && (
                    <TargetForm
                      target={{
                        title: `${selectedTarget.name} - ${new Date(selectedTarget.period.start).toLocaleDateString()} to ${new Date(selectedTarget.period.end).toLocaleDateString()}`,
                        type: "revenue",
                        targetValue: selectedTarget.targetAmount,
                        periodType: "monthly",
                        startDate: new Date(selectedTarget.period.start),
                        endDate: new Date(selectedTarget.period.end),
                        assignedTo: [selectedTarget.id],
                        assigneeType: selectedTarget.type,
                        status: selectedTarget.status === "In Progress" || selectedTarget.status === "Not Started"
                      }}
                      onSubmit={handleUpdateTarget}
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
                  Delete Target
                </Dialog.Title>
                
                <div className="mt-2">
                  <p className="text-sm text-gray-500 text-center">
                    Are you sure you want to delete the target for {selectedTarget?.name}? This action cannot be undone.
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
                    onClick={handleDeleteTarget}
                  >
                    Delete
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

export default SalesTargets;