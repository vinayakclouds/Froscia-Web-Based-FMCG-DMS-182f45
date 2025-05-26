import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import toast from "react-hot-toast";

const OrderEntryForm = ({ retailerId, onSubmit, onCancel }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [retailer, setRetailer] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [netAmount, setNetAmount] = useState(0);

  const [formData, setFormData] = useState({
    orderType: "regular",
    paymentType: "credit",
    deliveryDate: "",
    remarks: ""
  });

  // Fetch retailer details
  const fetchRetailerDetails = useCallback(async () => {
    try {
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockRetailer = {
        id: retailerId,
        businessName: "SuperMart Store",
        ownerName: "Rajesh Kumar",
        address: "123, Market Road, Mumbai - 400069",
        phone: "+91 98765 43210",
        creditLimit: 100000,
        currentDue: 25000,
        lastOrderDate: "2023-10-15",
        image: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxTdXBlck1hcnQlMkJzdG9yZSUyQmxvZ298ZW58MHx8fHwxNzQ3OTkxOTY2fDA&ixlib=rb-4.1.0&q=80&w=1080"
      };
      
      setRetailer(mockRetailer);
    } catch (error) {
      console.error("Error fetching retailer details:", error);
      toast.error("Failed to load retailer details");
    }
  }, [retailerId]);

  // Fetch product catalog
  const fetchProducts = useCallback(async () => {
    try {
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProducts = [
        {
          id: "1",
          name: "Premium Cola 2L",
          image: "https://images.unsplash.com/photo-1574670700790-fa314ab37787?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxDb2xhJTJCYm90dGxlfGVufDB8fHx8MTc0Nzk5MTk2OHww&ixlib=rb-4.1.0&q=80&w=1080",
          sku: "COL2L",
          mrp: 150.00,
          price: 140.00,
          category: "beverages",
          stock: 500,
          unit: "bottle",
          minOrderQty: 12
        },
        {
          id: "2",
          name: "Fruit Juice Mango 1L",
          image: "https://images.unsplash.com/photo-1601924287811-e34de5d17476?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxNYW5nbyUyQmp1aWNlJTJCcGFja2V0fGVufDB8fHx8MTc0Nzk5MTk2OXww&ixlib=rb-4.1.0&q=80&w=1080",
          sku: "FJM1L",
          mrp: 80.00,
          price: 75.00,
          category: "beverages",
          stock: 300,
          unit: "packet",
          minOrderQty: 24
        }
      ];
      
      setProducts(mockProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load product catalog");
    }
  }, []);

  // Fetch applicable schemes
  const fetchSchemes = useCallback(async () => {
    try {
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockSchemes = [
        {
          id: "1",
          name: "Buy 10 Get 1 Free",
          productId: "1",
          type: "quantity",
          buyQty: 10,
          getQty: 1
        },
        {
          id: "2",
          name: "10% Off on 24 Units",
          productId: "2",
          type: "discount",
          minQty: 24,
          discountPercent: 10
        }
      ];
      
      setSchemes(mockSchemes);
    } catch (error) {
      console.error("Error fetching schemes:", error);
      toast.error("Failed to load schemes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRetailerDetails();
    fetchProducts();
    fetchSchemes();
  }, [fetchRetailerDetails, fetchProducts, fetchSchemes]);

  useEffect(() => {
    calculateTotals();
  }, [selectedProducts]);

  const handleProductSelect = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setSelectedProducts(prev => {
      const exists = prev.find(p => p.id === productId);
      if (exists) return prev;

      return [...prev, {
        ...product,
        quantity: product.minOrderQty,
        discount: 0,
        total: product.price * product.minOrderQty
      }];
    });
  };

  const handleQuantityChange = (productId, quantity) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Validate quantity
    if (quantity < product.minOrderQty) {
      toast.error(`Minimum order quantity is ${product.minOrderQty} units`);
      return;
    }

    if (quantity > product.stock) {
      toast.error("Quantity exceeds available stock");
      return;
    }

    setSelectedProducts(prev => 
      prev.map(p => 
        p.id === productId
          ? {
              ...p,
              quantity,
              total: p.price * quantity - p.discount
            }
          : p
      )
    );

    // Apply schemes
    applySchemes(productId, quantity);
  };

  const applySchemes = (productId, quantity) => {
    const productSchemes = schemes.filter(s => s.productId === productId);
    if (!productSchemes.length) return;

    setSelectedProducts(prev => 
      prev.map(p => {
        if (p.id !== productId) return p;

        let discount = 0;
        productSchemes.forEach(scheme => {
          if (scheme.type === "quantity" && quantity >= scheme.buyQty) {
            const freeQty = Math.floor(quantity / scheme.buyQty) * scheme.getQty;
            discount = p.price * freeQty;
          } else if (scheme.type === "discount" && quantity >= scheme.minQty) {
            discount = (p.price * quantity * scheme.discountPercent) / 100;
          }
        });

        return {
          ...p,
          discount,
          total: p.price * quantity - discount
        };
      })
    );
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const calculateTotals = () => {
    const sub = selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const discount = selectedProducts.reduce((sum, p) => sum + p.discount, 0);
    
    setSubTotal(sub);
    setTotalDiscount(discount);
    setNetAmount(sub - discount);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedProducts.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    if (!formData.deliveryDate) {
      toast.error("Please select delivery date");
      return;
    }

    if (netAmount > (retailer.creditLimit - retailer.currentDue) && formData.paymentType === "credit") {
      toast.error("Order amount exceeds available credit limit");
      return;
    }

    try {
      setIsLoading(true);
      
      const orderData = {
        retailerId,
        items: selectedProducts,
        ...formData,
        subTotal,
        totalDiscount,
        netAmount
      };

      await onSubmit(orderData);
      toast.success("Order placed successfully");
      
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-gray-200 rounded"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
        <div className="h-60 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Retailer Details */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12">
            {retailer.image ? (
              <img
                className="h-12 w-12 rounded-full object-cover"
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
            <h3 className="text-lg font-medium text-gray-900">
              {retailer.businessName}
            </h3>
            <p className="text-sm text-gray-500">
              {retailer.address}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-900">Credit Limit: ₹{retailer.creditLimit.toLocaleString()}</p>
            <p className="text-sm text-red-600">Current Due: ₹{retailer.currentDue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Order Type
            </label>
            <select
              name="orderType"
              value={formData.orderType}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="regular">Regular Order</option>
              <option value="urgent">Urgent Order</option>
              <option value="advance">Advance Order</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Type
            </label>
            <select
              name="paymentType"
              value={formData.paymentType}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="credit">Credit</option>
              <option value="cash">Cash</option>
              <option value="online">Online</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Delivery Date
            </label>
            <input
              type="date"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Product Selection */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Add Products
          </label>
          <select
            onChange={(e) => handleProductSelect(e.target.value)}
            value=""
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="">Select a product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} - ₹{product.price} ({product.stock} in stock)
              </option>
            ))}
          </select>
        </div>

        {/* Selected Products Table */}
        <div className="mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {product.image ? (
                          <img
                            className="h-10 w-10 rounded object-cover"
                            src={product.image}
                            alt={product.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><polyline points="32.7 76.92 128 129.08 223.3 76.92" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M131.84,25l88,48.18a8,8,0,0,1,4.16,7v95.64a8,8,0,0,1-4.16,7l-88,48.18a8,8,0,0,1-7.68,0l-88-48.18a8,8,0,0,1-4.16-7V80.18a8,8,0,0,1,4.16-7l88-48.18A8,8,0,0,1,131.84,25Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="129.09" x2="128" y2="232" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          SKU: {product.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min={product.minOrderQty}
                      max={product.stock}
                      value={product.quantity}
                      onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    ₹{product.discount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{product.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow p-4">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Sub Total</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">
              ₹{subTotal.toFixed(2)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Total Discount</dt>
            <dd className="mt-1 text-lg font-semibold text-green-600">
              ₹{totalDiscount.toFixed(2)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Net Amount</dt>
            <dd className="mt-1 text-lg font-semibold text-primary-600">
              ₹{netAmount.toFixed(2)}
            </dd>
          </div>
        </dl>
      </div>

      {/* Remarks */}
      <div className="bg-white rounded-lg shadow p-4">
        <label className="block text-sm font-medium text-gray-700">
          Remarks
        </label>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleInputChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder="Enter any additional notes for this order"
        />
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
              <span className="ml-2">Processing...</span>
            </>
          ) : (
            "Place Order"
          )}
        </button>
      </div>
    </form>
  );
};

OrderEntryForm.propTypes = {
  retailerId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default OrderEntryForm;