import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import toast from "react-hot-toast";

const FeedbackForm = ({ onSubmit, onCancel, existingFeedback = null }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [competitors, setCompetitors] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    retailerId: "",
    category: "",
    feedbackType: "market_insight",
    competitorId: "",
    newCompetitor: {
      name: "",
      products: "",
      schemes: ""
    },
    productPerformance: {
      productId: "",
      feedback: "",
      issues: ""
    },
    marketTrends: {
      trend: "",
      impact: "positive",
      details: ""
    },
    competitorActivity: {
      type: "pricing",
      details: "",
      evidence: null
    },
    retailerSuggestions: "",
    consumerFeedback: "",
    priority: "medium",
    attachments: []
  });

  // Fetch reference data
  const fetchReferenceData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample data
      const mockCompetitors = [
        { id: "1", name: "CompetitorA", active: true },
        { id: "2", name: "CompetitorB", active: true }
      ];
      
      const mockRetailers = [
        {
          id: "1",
          name: "SuperMart Store",
          area: "Andheri East",
          image: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxTdXBlck1hcnQlMkJzdG9yZSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkxOTY2fDA&ixlib=rb-4.1.0&q=80&w=1080"
        },
        {
          id: "2",
          name: "Quick Shop",
          area: "Bandra West",
          image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxRdWljayUyQlNob3AlMkJzdG9yZSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkyMjcwfDA&ixlib=rb-4.1.0&q=80&w=1080"
        }
      ];
      
      const mockCategories = [
        { id: "1", name: "Beverages" },
        { id: "2", name: "Snacks" },
        { id: "3", name: "Household" }
      ];
      
      setCompetitors(mockCompetitors);
      setRetailers(mockRetailers);
      setCategories(mockCategories);
      
      // If editing existing feedback, populate form
      if (existingFeedback) {
        setFormData(existingFeedback);
      }
      
    } catch (error) {
      console.error("Error fetching reference data:", error);
      toast.error("Failed to load form data");
    } finally {
      setIsLoading(false);
    }
  }, [existingFeedback]);

  useEffect(() => {
    fetchReferenceData();
  }, [fetchReferenceData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB limit
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));
  };

  const handleRemoveAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.retailerId) {
      toast.error("Please select a retailer");
      return false;
    }

    if (!formData.category) {
      toast.error("Please select a product category");
      return false;
    }

    if (formData.feedbackType === "competitor_activity" && 
        !formData.competitorId && 
        !formData.newCompetitor.name) {
      toast.error("Please select a competitor or add new competitor details");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const formDataToSubmit = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === "attachments") {
          formData.attachments.forEach(file => {
            formDataToSubmit.append("attachments", file);
          });
        } else if (typeof formData[key] === "object") {
          formDataToSubmit.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSubmit.append(key, formData[key]);
        }
      });

      await onSubmit(formDataToSubmit);
      toast.success("Market feedback recorded successfully");

    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                  {retailer.name} - {retailer.area}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Product Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="feedbackType" className="block text-sm font-medium text-gray-700">
              Feedback Type *
            </label>
            <select
              id="feedbackType"
              name="feedbackType"
              value={formData.feedbackType}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="market_insight">Market Insight</option>
              <option value="competitor_activity">Competitor Activity</option>
              <option value="product_feedback">Product Feedback</option>
              <option value="consumer_trends">Consumer Trends</option>
              <option value="retailer_suggestion">Retailer Suggestion</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Competitor Information */}
      {formData.feedbackType === "competitor_activity" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Competitor Information</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="competitorId" className="block text-sm font-medium text-gray-700">
                Select Competitor
              </label>
              <select
                id="competitorId"
                name="competitorId"
                value={formData.competitorId}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Select a competitor</option>
                {competitors.map(competitor => (
                  <option key={competitor.id} value={competitor.id}>
                    {competitor.name}
                  </option>
                ))}
                <option value="new">+ Add New Competitor</option>
              </select>
            </div>

            {formData.competitorId === "new" && (
              <div className="space-y-4 border-t pt-4">
                <div>
                  <label htmlFor="newCompetitorName" className="block text-sm font-medium text-gray-700">
                    New Competitor Name *
                  </label>
                  <input
                    type="text"
                    id="newCompetitorName"
                    value={formData.newCompetitor.name}
                    onChange={(e) => handleNestedInputChange("newCompetitor", "name", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="newCompetitorProducts" className="block text-sm font-medium text-gray-700">
                    Products Offered
                  </label>
                  <textarea
                    id="newCompetitorProducts"
                    value={formData.newCompetitor.products}
                    onChange={(e) => handleNestedInputChange("newCompetitor", "products", e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="List main products offered by the competitor"
                  />
                </div>

                <div>
                  <label htmlFor="newCompetitorSchemes" className="block text-sm font-medium text-gray-700">
                    Current Schemes
                  </label>
                  <textarea
                    id="newCompetitorSchemes"
                    value={formData.newCompetitor.schemes}
                    onChange={(e) => handleNestedInputChange("newCompetitor", "schemes", e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Any ongoing schemes or promotions"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="activityType" className="block text-sm font-medium text-gray-700">
                Activity Type
              </label>
              <select
                id="activityType"
                value={formData.competitorActivity.type}
                onChange={(e) => handleNestedInputChange("competitorActivity", "type", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="pricing">Pricing Strategy</option>
                <option value="promotion">New Promotion</option>
                <option value="product">New Product Launch</option>
                <option value="distribution">Distribution Change</option>
                <option value="other">Other Activity</option>
              </select>
            </div>

            <div>
              <label htmlFor="activityDetails" className="block text-sm font-medium text-gray-700">
                Activity Details
              </label>
              <textarea
                id="activityDetails"
                value={formData.competitorActivity.details}
                onChange={(e) => handleNestedInputChange("competitorActivity", "details", e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Describe the competitor activity in detail"
              />
            </div>
          </div>
        </div>
      )}

      {/* Market Trends */}
      {formData.feedbackType === "market_insight" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Market Trends</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="trend" className="block text-sm font-medium text-gray-700">
                Observed Trend *
              </label>
              <textarea
                id="trend"
                value={formData.marketTrends.trend}
                onChange={(e) => handleNestedInputChange("marketTrends", "trend", e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Describe the market trend you've observed"
              />
            </div>

            <div>
              <label htmlFor="impact" className="block text-sm font-medium text-gray-700">
                Impact on Business
              </label>
              <select
                id="impact"
                value={formData.marketTrends.impact}
                onChange={(e) => handleNestedInputChange("marketTrends", "impact", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>

            <div>
              <label htmlFor="trendDetails" className="block text-sm font-medium text-gray-700">
                Additional Details
              </label>
              <textarea
                id="trendDetails"
                value={formData.marketTrends.details}
                onChange={(e) => handleNestedInputChange("marketTrends", "details", e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Provide more details about the trend and its implications"
              />
            </div>
          </div>
        </div>
      )}

      {/* Product Feedback */}
      {formData.feedbackType === "product_feedback" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Product Feedback</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                Product Performance *
              </label>
              <textarea
                id="feedback"
                value={formData.productPerformance.feedback}
                onChange={(e) => handleNestedInputChange("productPerformance", "feedback", e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Describe how the product is performing in the market"
              />
            </div>

            <div>
              <label htmlFor="issues" className="block text-sm font-medium text-gray-700">
                Issues or Concerns
              </label>
              <textarea
                id="issues"
                value={formData.productPerformance.issues}
                onChange={(e) => handleNestedInputChange("productPerformance", "issues", e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="List any issues or concerns reported"
              />
            </div>
          </div>
        </div>
      )}

      {/* Retailer Suggestions */}
      {formData.feedbackType === "retailer_suggestion" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Retailer Suggestions</h3>
          <div>
            <label htmlFor="retailerSuggestions" className="block text-sm font-medium text-gray-700">
              Suggestions/Feedback *
            </label>
            <textarea
              id="retailerSuggestions"
              name="retailerSuggestions"
              value={formData.retailerSuggestions}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Enter retailer's suggestions or feedback"
            />
          </div>
        </div>
      )}

      {/* Consumer Feedback */}
      {formData.feedbackType === "consumer_trends" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Consumer Feedback</h3>
          <div>
            <label htmlFor="consumerFeedback" className="block text-sm font-medium text-gray-700">
              Consumer Trends/Feedback *
            </label>
            <textarea
              id="consumerFeedback"
              name="consumerFeedback"
              value={formData.consumerFeedback}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Describe consumer preferences, feedback, or trends"
            />
          </div>
        </div>
      )}

      {/* Attachments */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Attachments</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Photos/Documents
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="sr-only"
                      accept="image/*,.pdf,.doc,.docx"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, PDF up to 5MB
                </p>
              </div>
            </div>
          </div>

          {formData.attachments.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files</h4>
              <ul className="divide-y divide-gray-200 border rounded-md">
                {formData.attachments.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between py-3 px-4 text-sm"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><polyline points="148 32 148 92 208 92" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M48,108V40a8,8,0,0,1,8-8h96l56,56v20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M32,152v56H48a28,28,0,0,0,0-56Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M220,200.87A22.12,22.12,0,0,1,204,208c-13.26,0-24-12.54-24-28s10.74-28,24-28a22.12,22.12,0,0,1,16,7.13" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><ellipse cx="128" cy="180" rx="24" ry="28" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                      <span className="ml-2 truncate">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(index)}
                      className="ml-4 text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="224" y1="128" x2="192" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="195.88" y1="195.88" x2="173.25" y2="173.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="224" x2="128" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="60.12" y1="195.88" x2="82.75" y2="173.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="32" y1="128" x2="64" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="60.12" y1="60.12" x2="82.75" y2="82.75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              <span className="ml-2">Submitting...</span>
            </>
          ) : (
            "Submit Feedback"
          )}
        </button>
      </div>
    </form>
  );
};

FeedbackForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  existingFeedback: PropTypes.shape({
    retailerId: PropTypes.string,
    category: PropTypes.string,
    feedbackType: PropTypes.string,
    competitorId: PropTypes.string,
    newCompetitor: PropTypes.shape({
      name: PropTypes.string,
      products: PropTypes.string,
      schemes: PropTypes.string
    }),
    productPerformance: PropTypes.shape({
      productId: PropTypes.string,
      feedback: PropTypes.string,
      issues: PropTypes.string
    }),
    marketTrends: PropTypes.shape({
      trend: PropTypes.string,
      impact: PropTypes.string,
      details: PropTypes.string
    }),
    competitorActivity: PropTypes.shape({
      type: PropTypes.string,
      details: PropTypes.string,
      evidence: PropTypes.any
    }),
    retailerSuggestions: PropTypes.string,
    consumerFeedback: PropTypes.string,
    priority: PropTypes.string,
    attachments: PropTypes.array
  })
};

export default FeedbackForm;