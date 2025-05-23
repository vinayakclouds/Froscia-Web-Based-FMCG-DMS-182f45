import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Tab } from "@headlessui/react";
import FeedbackForm from "../../components/forms/FeedbackForm";

const MarketFeedback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [filters, setFilters] = useState({
    type: "all",
    date: "all",
    search: ""
  });

  // Fetch feedback data
  const fetchFeedbacks = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample data
      const mockFeedbacks = [
        {
          id: "1",
          date: "2023-10-18",
          retailer: {
            id: "R1",
            name: "SuperMart Store",
            image: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxTdXBlck1hcnQlMkJzdG9yZSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkxOTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
            address: "123 Market Road, Mumbai"
          },
          type: "competitor_activity",
          competitor: {
            name: "CompetitorA",
            products: "Premium Cola 2L",
            schemes: "Buy 10 Get 1 Free"
          },
          details: "Competitor launched new scheme on cola products",
          priority: "high",
          status: "pending",
          attachments: [
            {
              name: "competitor_promo.jpg",
              type: "image/jpeg",
              url: "https://images.unsplash.com/photo-1512106374988-c95f566d39ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxDb21wZXRpdG9yJTJCcHJvbW90aW9uJTJCaW1hZ2V8ZW58MHx8fHwxNzQ3OTkzMjE0fDA&ixlib=rb-4.1.0&q=80&w=1080"
            }
          ]
        },
        {
          id: "2",
          date: "2023-10-17",
          retailer: {
            id: "R2",
            name: "Quick Shop",
            image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxRdWljayUyQlNob3AlMkJzdG9yZSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkyMjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
            address: "456 Hill Road, Mumbai"
          },
          type: "market_insight",
          marketTrends: {
            trend: "Increasing demand for small pack sizes",
            impact: "positive",
            details: "Customers prefer 200ml packs for immediate consumption"
          },
          priority: "medium",
          status: "reviewed",
          attachments: []
        }
      ];
      
      setFeedbacks(mockFeedbacks);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      toast.error("Failed to load feedback data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleSubmitFeedback = async (formData) => {
    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newFeedback = {
        id: Date.now().toString(),
        date: new Date().toISOString().split("T")[0],
        ...formData,
        status: "pending"
      };
      
      setFeedbacks(prev => [newFeedback, ...prev]);
      toast.success("Market feedback submitted successfully");
      
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter feedbacks based on current filters
  const filteredFeedbacks = feedbacks.filter(feedback => {
    if (filters.type !== "all" && feedback.type !== filters.type) {
      return false;
    }
    
    if (filters.date === "today") {
      if (feedback.date !== new Date().toISOString().split("T")[0]) {
        return false;
      }
    } else if (filters.date === "week") {
      const feedbackDate = new Date(feedback.date);
      const today = new Date();
      const diffTime = today.getTime() - feedbackDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 7) {
        return false;
      }
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        feedback.retailer.name.toLowerCase().includes(searchLower) ||
        (feedback.competitor?.name || "").toLowerCase().includes(searchLower) ||
        (feedback.details || "").toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "reviewed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Market Feedback</h3>
            <p className="mt-1 text-sm text-gray-500">
              Capture and track competitive intelligence and market insights
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white shadow rounded-lg">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-t-lg bg-gray-100 p-1">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                  selected
                    ? "bg-white shadow text-primary-700"
                    : "text-gray-700 hover:bg-white/[0.12] hover:text-gray-900"
                }`
              }
            >
              Add Feedback
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                  selected
                    ? "bg-white shadow text-primary-700"
                    : "text-gray-700 hover:bg-white/[0.12] hover:text-gray-900"
                }`
              }
            >
              View Feedbacks
            </Tab>
          </Tab.List>
          <Tab.Panels>
            {/* Add Feedback Panel */}
            <Tab.Panel className="p-6">
              <FeedbackForm
                onSubmit={handleSubmitFeedback}
                onCancel={() => {}}
              />
            </Tab.Panel>

            {/* View Feedbacks Panel */}
            <Tab.Panel className="p-6">
              {/* Filters */}
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Feedback Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="market_insight">Market Insight</option>
                    <option value="competitor_activity">Competitor Activity</option>
                    <option value="product_feedback">Product Feedback</option>
                    <option value="consumer_trends">Consumer Trends</option>
                    <option value="retailer_suggestion">Retailer Suggestion</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date Range
                  </label>
                  <select
                    id="date"
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                    Search
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
                      placeholder="Search feedbacks..."
                    />
                  </div>
                </div>
              </div>

              {/* Feedbacks List */}
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg border p-6">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredFeedbacks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="48" height="48"><rect width="256" height="256" fill="none"/><path d="M160,40h40a8,8,0,0,1,8,8V216a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8H96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M88,72V64a40,40,0,0,1,80,0v8Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No feedbacks found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add your first market feedback by using the "Add Feedback" tab.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFeedbacks.map(feedback => (
                    <div
                      key={feedback.id}
                      className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {feedback.retailer.image ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={feedback.retailer.image}
                                alt={feedback.retailer.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="16" y1="216" x2="240" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="224 216 224 76 176 76 176 40 80 40 80 112 32 112 32 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="76" x2="136" y2="76" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="112" x2="136" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="112" x2="188" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="68" y1="148" x2="84" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="148" x2="136" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="148" x2="188" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M148,216V176a4,4,0,0,0-4-4H112a4,4,0,0,0-4,4v40Z"/></svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-900">
                              {feedback.retailer.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {feedback.retailer.address}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                            {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(feedback.priority)}`}>
                            {feedback.priority.charAt(0).toUpperCase() + feedback.priority.slice(1)} Priority
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {feedback.type === "competitor_activity" && feedback.competitor && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h5 className="text-sm font-medium text-gray-900 mb-2">
                              Competitor Activity
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs font-medium text-gray-500">Competitor</p>
                                <p className="mt-1 text-sm text-gray-900">{feedback.competitor.name}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500">Products</p>
                                <p className="mt-1 text-sm text-gray-900">{feedback.competitor.products}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500">Schemes</p>
                                <p className="mt-1 text-sm text-gray-900">{feedback.competitor.schemes}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {feedback.type === "market_insight" && feedback.marketTrends && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h5 className="text-sm font-medium text-gray-900 mb-2">
                              Market Insight
                            </h5>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-900">{feedback.marketTrends.trend}</p>
                              <div className="flex items-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  feedback.marketTrends.impact === "positive"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {feedback.marketTrends.impact.charAt(0).toUpperCase() + feedback.marketTrends.impact.slice(1)} Impact
                                </span>
                              </div>
                              {feedback.marketTrends.details && (
                                <p className="text-sm text-gray-600">{feedback.marketTrends.details}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {feedback.details && (
                          <p className="text-sm text-gray-600">{feedback.details}</p>
                        )}

                        {feedback.attachments && feedback.attachments.length > 0 && (
                          <div className="border-t pt-4">
                            <h5 className="text-sm font-medium text-gray-900 mb-2">
                              Attachments
                            </h5>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              {feedback.attachments.map((attachment, index) => (
                                <div
                                  key={index}
                                  className="relative group aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100"
                                >
                                  {attachment.type.startsWith("image/") ? (
                                    <img
                                      src={attachment.url}
                                      alt={attachment.name}
                                      className="object-cover w-full h-full"
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center h-full">
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><polyline points="148 32 148 92 208 92" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M48,108V40a8,8,0,0,1,8-8h96l56,56v20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M32,152v56H48a28,28,0,0,0,0-56Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M220,200.87A22.12,22.12,0,0,1,204,208c-13.26,0-24-12.54-24-28s10.74-28,24-28a22.12,22.12,0,0,1,16,7.13" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><ellipse cx="128" cy="180" rx="24" ry="28" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                                    <div className="hidden group-hover:flex space-x-2">
                                      <button
                                        type="button"
                                        className="p-2 bg-white rounded-full hover:bg-gray-100"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><line x1="128" y1="144" x2="128" y2="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="216 144 216 208 40 208 40 144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="168 104 128 144 88 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                                      </button>
                                      <button
                                        type="button"
                                        className="p-2 bg-white rounded-full hover:bg-gray-100"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><rect x="48" y="120" width="88" height="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M208,188v12a8,8,0,0,1-8,8H180" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="208" y1="116" x2="208" y2="140" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M184,48h16a8,8,0,0,1,8,8V72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="116" y1="48" x2="140" y2="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M48,76V56a8,8,0,0,1,8-8H68" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center text-sm text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="176" y1="24" x2="176" y2="52" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="80" y1="24" x2="80" y2="52" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="40" y1="88" x2="216" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="84 132 100 124 100 180" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M138.14,132a16,16,0,1,1,26.64,17.63L136,180h32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                            <span className="ml-1.5">{feedback.date}</span>
                          </div>
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Quick Help Tips */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="88" y1="232" x2="168" y2="232" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M78.7,167A79.87,79.87,0,0,1,48,104.45C47.76,61.09,82.72,25,126.07,24a80,80,0,0,1,51.34,142.9A24.3,24.3,0,0,0,168,186v2a8,8,0,0,1-8,8H96a8,8,0,0,1-8-8v-2A24.11,24.11,0,0,0,78.7,167Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M140,70a36.39,36.39,0,0,1,24,30" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Feedback Tips</h3>
            <div className="mt-2 text-sm text-blue-700 space-y-1">
              <p>• Document competitor activities with specific details about products and schemes</p>
              <p>• Capture consumer feedback and preferences to identify market trends</p>
              <p>• Include photos of competitor products or promotional materials when possible</p>
              <p>• Mark high priority for urgent competitive threats or opportunities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketFeedback;