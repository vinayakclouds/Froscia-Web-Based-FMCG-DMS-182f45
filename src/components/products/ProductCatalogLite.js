import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import toast from "react-hot-toast";

const ProductCatalogLite = ({
  onProductSelect,
  preSelectedProducts = [],
  categoryFilter = "all",
  maxHeight = "600px"
}) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter);
  const [viewMode, setViewMode] = useState("grid");
  const [sort, setSort] = useState({ field: "name", direction: "asc" });
  
  const searchInputRef = useRef(null);

  // Fetch products data
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Simulated API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProducts = [
        {
          id: "1",
          sku: "COL2L",
          name: "Premium Cola 2L",
          category: "beverages",
          price: 140.00,
          mrp: 150.00,
          stock: 500,
          minOrderQty: 12,
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxDb2xhJTJCYm90dGxlJTJCcHJvZHVjdCUyQmltYWdlfGVufDB8fHx8MTc0Nzk4OTcyMHww&ixlib=rb-4.1.0&q=80&w=1080",
          unit: "bottle",
          schemes: [
            { type: "quantity", buy: 10, get: 1 },
            { type: "discount", minQty: 24, percentage: 10 }
          ]
        },
        {
          id: "2",
          sku: "FJM1L",
          name: "Fruit Juice Mango 1L",
          category: "beverages",
          price: 75.00,
          mrp: 80.00,
          stock: 300,
          minOrderQty: 24,
          image: "https://images.unsplash.com/photo-1601924287811-e34de5d17476?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxNYW5nbyUyQmp1aWNlJTJCcGFja2V0JTJCaW1hZ2V8ZW58MHx8fHwxNzQ3OTg5NzIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
          unit: "packet",
          schemes: [
            { type: "discount", minQty: 48, percentage: 15 }
          ]
        },
        {
          id: "3",
          sku: "CHP100",
          name: "Chips Classic 100g",
          category: "snacks",
          price: 45.00,
          mrp: 50.00,
          stock: 1000,
          minOrderQty: 48,
          image: "https://images.unsplash.com/photo-1576642589592-7d9778a1c9e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxDaGlwcyUyQnBhY2tldCUyQmltYWdlfGVufDB8fHx8MTc0Nzk5MDU4OXww&ixlib=rb-4.1.0&q=80&w=1080",
          unit: "packet",
          schemes: []
        }
      ];
      
      setProducts(mockProducts);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(mockProducts.map(p => p.category))];
      setCategories(uniqueCategories);
      
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load product catalog");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];
    
    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const direction = sort.direction === "asc" ? 1 : -1;
      if (sort.field === "price") {
        return (a.price - b.price) * direction;
      }
      return a[sort.field].localeCompare(b[sort.field]) * direction;
    });
    
    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery, sort]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((query) => setSearchQuery(query), 300),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleSort = (field) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const handleProductClick = (product) => {
    if (product.stock < product.minOrderQty) {
      toast.error(`Insufficient stock. Minimum order quantity is ${product.minOrderQty}`);
      return;
    }
    onProductSelect(product);
  };

  const isProductSelected = (productId) => {
    return preSelectedProducts.some(p => p.id === productId);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg h-48"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="80" y1="112" x2="144" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="112" cy="112" r="80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="168.57" y1="168.57" x2="224" y2="224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="112" y1="80" x2="112" y2="144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <input
              type="text"
              ref={searchInputRef}
              onChange={handleSearchChange}
              placeholder="Search products by name or SKU"
              className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${
                viewMode === "grid"
                  ? "bg-primary-100 text-primary-600"
                  : "text-gray-400 hover:text-gray-500"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><rect x="48" y="48" width="160" height="160" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="48" x2="128" y2="208" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="48" y1="128" x2="208" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${
                viewMode === "list"
                  ? "bg-primary-100 text-primary-600"
                  : "text-gray-400 hover:text-gray-500"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="40" y1="64" x2="216" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="40" y1="128" x2="104" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="40" y1="192" x2="120" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="184" cy="144" r="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="206.63" y1="166.63" x2="232" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div
        className="overflow-y-auto"
        style={{ maxHeight }}
      >
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="48" height="48"><rect width="256" height="256" fill="none"/><rect x="48" y="120" width="88" height="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M208,188v12a8,8,0,0,1-8,8H180" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="208" y1="116" x2="208" y2="140" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M184,48h16a8,8,0,0,1,8,8V72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="116" y1="48" x2="140" y2="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M48,76V56a8,8,0,0,1,8-8H68" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className={`relative rounded-lg border p-4 cursor-pointer transition-shadow hover:shadow-lg ${
                  isProductSelected(product.id)
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-primary-200"
                }`}
              >
                <div className="aspect-w-1 aspect-h-1 mb-4">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-center object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="32" height="32"><rect width="256" height="256" fill="none"/><polyline points="32.7 76.92 128 129.08 223.3 76.92" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M131.84,25l88,48.18a8,8,0,0,1,4.16,7v95.64a8,8,0,0,1-4.16,7l-88,48.18a8,8,0,0,1-7.68,0l-88-48.18a8,8,0,0,1-4.16-7V80.18a8,8,0,0,1,4.16-7l88-48.18A8,8,0,0,1,131.84,25Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="129.09" x2="128" y2="232" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      ₹{product.price}
                    </p>
                    {product.mrp > product.price && (
                      <p className="text-xs text-gray-500 line-through">
                        ₹{product.mrp}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      Stock: {product.stock} {product.unit}s
                    </p>
                    <p className="text-xs text-gray-500">
                      Min: {product.minOrderQty}
                    </p>
                  </div>
                </div>
                {product.schemes.length > 0 && (
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="12" height="12"><rect width="256" height="256" fill="none"/><path d="M84.27,171.73l-55.09-20.3a7.92,7.92,0,0,1,0-14.86l55.09-20.3,20.3-55.09a7.92,7.92,0,0,1,14.86,0l20.3,55.09,55.09,20.3a7.92,7.92,0,0,1,0,14.86l-55.09,20.3-20.3,55.09a7.92,7.92,0,0,1-14.86,0Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="176" y1="16" x2="176" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="224" y1="72" x2="224" y2="104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="152" y1="40" x2="200" y2="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="208" y1="88" x2="240" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                      <span className="ml-1">Offer</span>
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="border rounded-lg divide-y">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                  isProductSelected(product.id)
                    ? "bg-primary-50"
                    : ""
                }`}
              >
                <div className="flex-shrink-0 w-16 h-16">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-center object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><polyline points="32.7 76.92 128 129.08 223.3 76.92" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M131.84,25l88,48.18a8,8,0,0,1,4.16,7v95.64a8,8,0,0,1-4.16,7l-88,48.18a8,8,0,0,1-7.68,0l-88-48.18a8,8,0,0,1-4.16-7V80.18a8,8,0,0,1,4.16-7l88-48.18A8,8,0,0,1,131.84,25Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="129.09" x2="128" y2="232" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <div className="text-sm font-medium text-gray-900">
                      ₹{product.price}
                    </div>
                  </div>
                  <div className="mt-1 flex justify-between">
                    <p className="text-sm text-gray-500">
                      SKU: {product.sku}
                    </p>
                    {product.mrp > product.price && (
                      <p className="text-sm text-gray-500 line-through">
                        ₹{product.mrp}
                      </p>
                    )}
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Stock: {product.stock} {product.unit}s
                    </p>
                    <p className="text-sm text-gray-500">
                      Min Order: {product.minOrderQty}
                    </p>
                    {product.schemes.length > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="12" height="12"><rect width="256" height="256" fill="none"/><path d="M84.27,171.73l-55.09-20.3a7.92,7.92,0,0,1,0-14.86l55.09-20.3,20.3-55.09a7.92,7.92,0,0,1,14.86,0l20.3,55.09,55.09,20.3a7.92,7.92,0,0,1,0,14.86l-55.09,20.3-20.3,55.09a7.92,7.92,0,0,1-14.86,0Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="176" y1="16" x2="176" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="224" y1="72" x2="224" y2="104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="152" y1="40" x2="200" y2="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="208" y1="88" x2="240" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                        <span className="ml-1">Offer Available</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

ProductCatalogLite.propTypes = {
  onProductSelect: PropTypes.func.isRequired,
  preSelectedProducts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  ),
  categoryFilter: PropTypes.string,
  maxHeight: PropTypes.string
};

export default ProductCatalogLite;