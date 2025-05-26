import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import OrderEntryForm from "../../components/forms/OrderEntryForm";
import ProductCatalogLite from "../../components/products/ProductCatalogLite";
import toast from "react-hot-toast";

const OrderEntry = () => {
  const [retailers, setRetailers] = useState([]);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isFormMode, setIsFormMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Fetch retailers data
  const fetchRetailers = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample retailers data
      const mockRetailers = [
        {
          id: "1",
          businessName: "SuperMart Store",
          ownerName: "Rajesh Kumar",
          address: "123, Market Road, Mumbai - 400069",
          phone: "+91 98765 43210",
          area: "Andheri East",
          creditLimit: 100000,
          currentDue: 25000,
          lastOrderDate: "2023-10-01",
          image: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxTdXBlck1hcnQlMkJzdG9yZSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkxOTY2fDA&ixlib=rb-4.1.0&q=80&w=1080"
        },
        {
          id: "2",
          businessName: "Quick Stop",
          ownerName: "Priya Patel",
          address: "45, Hill Road, Mumbai - 400050",
          phone: "+91 87654 32109",
          area: "Bandra West",
          creditLimit: 80000,
          currentDue: 15000,
          lastOrderDate: "2023-10-05",
          image: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxRdWljayUyQlN0b3AlMkJzdG9yZSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkxOTcyfDA&ixlib=rb-4.1.0&q=80&w=1080"
        },
        {
          id: "3",
          businessName: "Family Grocers",
          ownerName: "Amit Singh",
          address: "78, Market Complex, Dadar",
          phone: "+91 76543 21098",
          area: "Dadar",
          creditLimit: 120000,
          currentDue: 32000,
          lastOrderDate: "2023-09-29",
          image: "https://images.unsplash.com/photo-1523951778169-4cb35545bfa2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxGYW1pbHklMkJHcm9jZXJzJTJCc3RvcmUlMkJsb2dvfGVufDB8fHx8MTc0Nzk5MTk3N3ww&ixlib=rb-4.1.0&q=80&w=1080"
        }
      ];
      
      setRetailers(mockRetailers);
    } catch (error) {
      console.error("Error fetching retailers:", error);
      toast.error("Failed to load retailers");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRetailers();
  }, [fetchRetailers]);

  const handleRetailerSelect = (retailerId) => {
    const retailer = retailers.find(r => r.id === retailerId);
    if (retailer) {
      setSelectedRetailer(retailer);
      setIsFormMode(true);
    }
  };

  const handleProductSelect = (product) => {
    const existingProductIndex = selectedProducts.findIndex(p => p.id === product.id);
    
    if (existingProductIndex >= 0) {
      // Product already in the list, update quantity
      const updatedProducts = [...selectedProducts];
      updatedProducts[existingProductIndex].quantity += product.minOrderQty;
      setSelectedProducts(updatedProducts);
    } else {
      // Add new product to the list
      setSelectedProducts([...selectedProducts, {
        ...product,
        quantity: product.minOrderQty,
        total: product.price * product.minOrderQty
      }]);
    }
    
    toast.success(`${product.name} added to order`);
  };

  const handleOrderSubmit = async (orderData) => {
    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Order placed successfully!");
      navigate("/salesman/dashboard");
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isFormMode) {
      // Go back to retailer selection
      setIsFormMode(false);
      setSelectedRetailer(null);
      setSelectedProducts([]);
    } else {
      // Go back to dashboard
      navigate("/salesman/dashboard");
    }
  };

  // Filter retailers based on search query
  const filteredRetailers = retailers.filter(
    retailer => 
      retailer.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retailer.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retailer.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusClass = (retailer) => {
    const duePercentage = (retailer.currentDue / retailer.creditLimit) * 100;
    
    if (duePercentage >= 80) {
      return "bg-red-100 border-red-300 text-red-800";
    } else if (duePercentage >= 50) {
      return "bg-yellow-100 border-yellow-300 text-yellow-800";
    } else {
      return "bg-green-100 border-green-300 text-green-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900">
          {isFormMode 
            ? `New Order - ${selectedRetailer.businessName}`
            : "Place New Order"
          }
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {isFormMode 
            ? "Add products and complete order details"
            : "Select a retailer to place a new order"
          }
        </p>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="animate-pulse space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      ) : isFormMode ? (
        <div className="bg-white shadow rounded-lg p-6">
          <OrderEntryForm
            retailerId={selectedRetailer.id}
            onSubmit={handleOrderSubmit}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          {/* Search Retailers */}
          <div className="mb-6">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search by name or area"
              />
            </div>
          </div>
          
          {/* Retailers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRetailers.length > 0 ? (
              filteredRetailers.map(retailer => (
                <div
                  key={retailer.id}
                  onClick={() => handleRetailerSelect(retailer.id)}
                  className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      {retailer.image ? (
                        <img
                          className="h-12 w-12 rounded-full"
                          src={retailer.image}
                          alt={retailer.businessName}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="16" y1="216" x2="240" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="224 216 224 76 176 76 176 40 80 40 80 112 32 112 32 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="76" x2="136" y2="76" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="112" x2="136" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="112" x2="188" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="68" y1="148" x2="84" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="148" x2="136" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="148" x2="188" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M148,216V176a4,4,0,0,0-4-4H112a4,4,0,0,0-4,4v40Z"/></svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{retailer.businessName}</h4>
                      <p className="text-sm text-gray-500">{retailer.ownerName}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-700">
                    <div className="flex items-center mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="48" r="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="208" r="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                      <span className="ml-1 truncate">{retailer.area}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><rect x="64" y="24" width="128" height="208" rx="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="64" y1="64" x2="192" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="64" y1="192" x2="192" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                      <span className="ml-1">{retailer.phone}</span>
                    </div>
                  </div>
                  
                  <div className={`mt-3 px-2 py-1 rounded-md border text-xs ${getStatusClass(retailer)}`}>
                    <div className="flex justify-between items-center">
                      <span>Credit Limit:</span>
                      <span>₹{retailer.creditLimit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span>Current Due:</span>
                      <span>₹{retailer.currentDue.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-500">
                    Last Order: {new Date(retailer.lastOrderDate).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <div className="flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="48" height="48"><rect width="256" height="256" fill="none"/><rect x="48" y="120" width="88" height="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M208,188v12a8,8,0,0,1-8,8H180" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="208" y1="116" x2="208" y2="140" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M184,48h16a8,8,0,0,1,8,8V72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="116" y1="48" x2="140" y2="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M48,76V56a8,8,0,0,1,8-8H68" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No retailers found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search terms or check with your manager.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Help Tips */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="88" y1="232" x2="168" y2="232" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M78.7,167A79.87,79.87,0,0,1,48,104.45C47.76,61.09,82.72,25,126.07,24a80,80,0,0,1,51.34,142.9A24.3,24.3,0,0,0,168,186v2a8,8,0,0,1-8,8H96a8,8,0,0,1-8-8v-2A24.11,24.11,0,0,0,78.7,167Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M140,70a36.39,36.39,0,0,1,24,30" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Tips for taking orders</h3>
            <div className="mt-2 text-sm text-blue-700 space-y-1">
              <p>• Check the retailer's credit limit and current dues before taking orders</p>
              <p>• Verify the delivery address and contact details</p>
              <p>• Inform the retailer about active schemes and promotions</p>
              <p>• Take note of any specific delivery instructions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderEntry;