import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";

const RetailerVisits = ({ data = null }) => {
  const [visitStats, setVisitStats] = useState({
    totalPlanned: 0,
    completed: 0,
    pending: 0,
    completionRate: 0
  });
  const [todayVisits, setTodayVisits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVisitData = async () => {
      try {
        // Simulated API call - replace with actual API integration
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Sample data - replace with API response
        const mockData = {
          stats: {
            totalPlanned: 35,
            completed: 28,
            pending: 7,
            completionRate: 80
          },
          todayVisits: [
            {
              id: "1",
              retailerName: "SuperMart Store",
              retailerImage: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxTdXBlck1hcnQlMkJzdG9yZSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkxOTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
              address: "123 Main Street, Andheri East",
              time: "10:30 AM",
              status: "completed",
              feedback: "Order placed successfully"
            },
            {
              id: "2",
              retailerName: "Quick Shop",
              retailerImage: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxRdWljayUyQlNob3AlMkJzdG9yZSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkyMjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
              address: "456 Market Road, Bandra West",
              time: "2:00 PM",
              status: "pending"
            },
            {
              id: "3",
              retailerName: "Mini Market",
              retailerImage: "https://images.unsplash.com/photo-1517137744310-173515c62d59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxNaW5pJTJCTWFya2V0JTJCc3RvcmUlMkJsb2dvfGVufDB8fHx8MTc0Nzk5MTk4NHww&ixlib=rb-4.1.0&q=80&w=1080",
              address: "789 Lake View, Powai",
              time: "4:30 PM",
              status: "pending"
            }
          ]
        };

        setVisitStats(mockData.stats);
        setTodayVisits(mockData.todayVisits);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching visit data:", error);
        setIsLoading(false);
      }
    };

    fetchVisitData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">Retailer Visits</h3>
      </div>

      {/* Visit Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="176" y1="24" x2="176" y2="52" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="80" y1="24" x2="80" y2="52" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="40" y1="88" x2="216" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="84 132 100 124 100 180" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M138.14,132a16,16,0,1,1,26.64,17.63L136,180h32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-800">Total Planned</p>
              <p className="text-lg font-semibold text-purple-900">
                {visitStats.totalPlanned}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><polyline points="88 136 112 160 168 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">Completed</p>
              <p className="text-lg font-semibold text-green-900">
                {visitStats.completed}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-3">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="128 72 128 128 184 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-800">Pending</p>
              <p className="text-lg font-semibold text-yellow-900">
                {visitStats.pending}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><polyline points="224 208 32 208 32 48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="224 96 160 152 96 104 32 160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-800">Completion Rate</p>
              <p className="text-lg font-semibold text-blue-900">
                {visitStats.completionRate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Today's Schedule</h4>
        <div className="space-y-3">
          {todayVisits.length > 0 ? (
            todayVisits.map((visit) => (
              <div
                key={visit.id}
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0 h-10 w-10">
                  {visit.retailerImage ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={visit.retailerImage}
                      alt={visit.retailerName}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="16" y1="216" x2="240" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="224 216 224 76 176 76 176 40 80 40 80 112 32 112 32 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="76" x2="136" y2="76" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="112" x2="136" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="112" x2="188" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="68" y1="148" x2="84" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="148" x2="136" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="148" x2="188" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M148,216V176a4,4,0,0,0-4-4H112a4,4,0,0,0-4,4v40Z"/></svg>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {visit.retailerName}
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        visit.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {visit.status === "completed" ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="12" height="12"><rect width="256" height="256" fill="none"/><rect x="48" y="120" width="88" height="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M208,188v12a8,8,0,0,1-8,8H180" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="208" y1="116" x2="208" y2="140" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M184,48h16a8,8,0,0,1,8,8V72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="116" y1="48" x2="140" y2="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M48,76V56a8,8,0,0,1,8-8H68" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                          <span className="ml-1">Completed</span>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="12" height="12"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="128 72 128 128 184 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                          <span className="ml-1">Pending</span>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <span className="truncate">{visit.address}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="128 72 128 128 184 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                      <span className="ml-1.5">{visit.time}</span>
                    </div>
                    {visit.feedback && (
                      <p className="text-sm text-green-600">{visit.feedback}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="40" height="40"><rect width="256" height="256" fill="none"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="176" y1="24" x2="176" y2="52" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="80" y1="24" x2="80" y2="52" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="40" y1="88" x2="216" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No visits scheduled
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                There are no retailer visits scheduled for today.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

RetailerVisits.propTypes = {
  data: PropTypes.shape({
    stats: PropTypes.shape({
      totalPlanned: PropTypes.number,
      completed: PropTypes.number,
      pending: PropTypes.number,
      completionRate: PropTypes.number
    }),
    todayVisits: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        retailerName: PropTypes.string.isRequired,
        retailerImage: PropTypes.string,
        address: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
        status: PropTypes.oneOf(["completed", "pending"]).isRequired,
        feedback: PropTypes.string
      })
    )
  })
};

export default RetailerVisits;