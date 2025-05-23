import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const ReportFilters = ({
  onFiltersChange,
  availableFilters = ["date", "entity", "product", "location"],
  initialFilters = {},
  showApplyButton = true
}) => {
  const [dateRange, setDateRange] = useState({
    startDate: initialFilters.startDate || null,
    endDate: initialFilters.endDate || null
  });
  const [quickDate, setQuickDate] = useState(initialFilters.quickDate || "custom");
  const [entity, setEntity] = useState(initialFilters.entity || "all");
  const [entityType, setEntityType] = useState(initialFilters.entityType || "all");
  const [product, setProduct] = useState(initialFilters.product || "all");
  const [category, setCategory] = useState(initialFilters.category || "all");
  const [location, setLocation] = useState(initialFilters.location || "all");
  const [region, setRegion] = useState(initialFilters.region || "all");
  const [compareMode, setCompareMode] = useState(initialFilters.compareMode || false);
  const [comparisonDateRange, setComparisonDateRange] = useState({
    startDate: initialFilters.comparisonStartDate || null,
    endDate: initialFilters.comparisonEndDate || null
  });

  // Sample options for dropdowns
  const entityTypes = [
    { value: "all", label: "All Types" },
    { value: "distributor", label: "Distributor" },
    { value: "superstockist", label: "Superstockist" },
    { value: "salesman", label: "Salesman" }
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "beverages", label: "Beverages" },
    { value: "snacks", label: "Snacks" },
    { value: "groceries", label: "Groceries" }
  ];

  const regions = [
    { value: "all", label: "All Regions" },
    { value: "north", label: "North" },
    { value: "south", label: "South" },
    { value: "east", label: "East" },
    { value: "west", label: "West" }
  ];

  // Quick date options
  const quickDateOptions = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "thisWeek", label: "This Week" },
    { value: "lastWeek", label: "Last Week" },
    { value: "thisMonth", label: "This Month" },
    { value: "lastMonth", label: "Last Month" },
    { value: "thisQuarter", label: "This Quarter" },
    { value: "lastQuarter", label: "Last Quarter" },
    { value: "thisYear", label: "This Year" },
    { value: "lastYear", label: "Last Year" },
    { value: "custom", label: "Custom Range" }
  ];

  useEffect(() => {
    if (quickDate !== "custom") {
      const now = new Date();
      let start = new Date();
      let end = new Date();

      switch (quickDate) {
        case "today":
          start = now;
          end = now;
          break;
        case "yesterday":
          start.setDate(now.getDate() - 1);
          end = start;
          break;
        case "thisWeek":
          start.setDate(now.getDate() - now.getDay());
          break;
        case "lastWeek":
          start.setDate(now.getDate() - now.getDay() - 7);
          end.setDate(now.getDate() - now.getDay() - 1);
          break;
        case "thisMonth":
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
        case "lastMonth":
          start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          end = new Date(now.getFullYear(), now.getMonth(), 0);
          break;
        case "thisQuarter":
          const quarter = Math.floor(now.getMonth() / 3);
          start = new Date(now.getFullYear(), quarter * 3, 1);
          end = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
          break;
        case "lastQuarter":
          const lastQuarter = Math.floor(now.getMonth() / 3) - 1;
          start = new Date(now.getFullYear(), lastQuarter * 3, 1);
          end = new Date(now.getFullYear(), (lastQuarter + 1) * 3, 0);
          break;
        case "thisYear":
          start = new Date(now.getFullYear(), 0, 1);
          end = new Date(now.getFullYear(), 11, 31);
          break;
        case "lastYear":
          start = new Date(now.getFullYear() - 1, 0, 1);
          end = new Date(now.getFullYear() - 1, 11, 31);
          break;
        default:
          break;
      }

      setDateRange({ startDate: start, endDate: end });
    }
  }, [quickDate]);

  const handleApplyFilters = () => {
    const filters = {
      dateRange: {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      },
      quickDate,
      entity,
      entityType,
      product,
      category,
      location,
      region,
      compareMode,
      ...(compareMode && {
        comparisonDateRange: {
          startDate: comparisonDateRange.startDate,
          endDate: comparisonDateRange.endDate
        }
      })
    };

    onFiltersChange(filters);
  };

  useEffect(() => {
    if (!showApplyButton) {
      handleApplyFilters();
    }
  }, [
    dateRange,
    quickDate,
    entity,
    entityType,
    product,
    category,
    location,
    region,
    compareMode,
    comparisonDateRange,
    showApplyButton
  ]);

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
      <div className="space-y-6">
        {/* Date Range Section */}
        {availableFilters.includes("date") && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Date Range</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <select
                  value={quickDate}
                  onChange={(e) => setQuickDate(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  {quickDateOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {quickDate === "custom" && (
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <DatePicker
                      selected={dateRange.startDate}
                      onChange={(date) => setDateRange(prev => ({ ...prev, startDate: date }))}
                      selectsStart
                      startDate={dateRange.startDate}
                      endDate={dateRange.endDate}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholderText="Start Date"
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                  <div className="flex-1">
                    <DatePicker
                      selected={dateRange.endDate}
                      onChange={(date) => setDateRange(prev => ({ ...prev, endDate: date }))}
                      selectsEnd
                      startDate={dateRange.startDate}
                      endDate={dateRange.endDate}
                      minDate={dateRange.startDate}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholderText="End Date"
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={compareMode}
                  onChange={(e) => setCompareMode(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-600">Compare with previous period</span>
              </label>
            </div>

            {compareMode && quickDate === "custom" && (
              <div className="mt-3 flex space-x-2">
                <div className="flex-1">
                  <DatePicker
                    selected={comparisonDateRange.startDate}
                    onChange={(date) => setComparisonDateRange(prev => ({ ...prev, startDate: date }))}
                    selectsStart
                    startDate={comparisonDateRange.startDate}
                    endDate={comparisonDateRange.endDate}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholderText="Comparison Start Date"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div className="flex-1">
                  <DatePicker
                    selected={comparisonDateRange.endDate}
                    onChange={(date) => setComparisonDateRange(prev => ({ ...prev, endDate: date }))}
                    selectsEnd
                    startDate={comparisonDateRange.startDate}
                    endDate={comparisonDateRange.endDate}
                    minDate={comparisonDateRange.startDate}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholderText="Comparison End Date"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Entity Filters */}
        {availableFilters.includes("entity") && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Entity Filters</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Entity Type</label>
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  {entityTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Select Entity</label>
                <select
                  value={entity}
                  onChange={(e) => setEntity(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="all">All Entities</option>
                  {entityType === "distributor" && (
                    <>
                      <option value="dist1">Distributor 1</option>
                      <option value="dist2">Distributor 2</option>
                    </>
                  )}
                  {entityType === "superstockist" && (
                    <>
                      <option value="super1">Superstockist 1</option>
                      <option value="super2">Superstockist 2</option>
                    </>
                  )}
                  {entityType === "salesman" && (
                    <>
                      <option value="sales1">Salesman 1</option>
                      <option value="sales2">Salesman 2</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Product Filters */}
        {availableFilters.includes("product") && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Product Filters</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Product</label>
                <select
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="all">All Products</option>
                  {category === "beverages" && (
                    <>
                      <option value="cola">Premium Cola 2L</option>
                      <option value="juice">Fruit Juice Mango 1L</option>
                    </>
                  )}
                  {category === "snacks" && (
                    <>
                      <option value="chips">Classic Chips</option>
                      <option value="nuts">Mixed Nuts</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Location Filters */}
        {availableFilters.includes("location") && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Location Filters</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  {regions.map(reg => (
                    <option key={reg.value} value={reg.value}>
                      {reg.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="all">All Locations</option>
                  {region === "north" && (
                    <>
                      <option value="delhi">Delhi</option>
                      <option value="chandigarh">Chandigarh</option>
                    </>
                  )}
                  {region === "south" && (
                    <>
                      <option value="bangalore">Bangalore</option>
                      <option value="chennai">Chennai</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Apply Button */}
        {showApplyButton && (
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setDateRange({ startDate: null, endDate: null });
                setQuickDate("thisMonth");
                setEntity("all");
                setEntityType("all");
                setProduct("all");
                setCategory("all");
                setLocation("all");
                setRegion("all");
                setCompareMode(false);
                setComparisonDateRange({ startDate: null, endDate: null });
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><rect x="48" y="120" width="88" height="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M208,188v12a8,8,0,0,1-8,8H180" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="208" y1="116" x2="208" y2="140" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M184,48h16a8,8,0,0,1,8,8V72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="116" y1="48" x2="140" y2="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M48,76V56a8,8,0,0,1,8-8H68" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              <span className="ml-2">Reset</span>
            </button>
            <button
              type="button"
              onClick={handleApplyFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><line x1="64" y1="136" x2="192" y2="136" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="24" y1="88" x2="232" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="104" y1="184" x2="152" y2="184" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              <span className="ml-2">Apply Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportFilters;