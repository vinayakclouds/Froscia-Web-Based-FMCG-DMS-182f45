import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { Switch } from "@headlessui/react";

const ProductForm = ({ product, onSubmit, isLoading }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [categories] = useState([
    "Carbonated Drinks",
    "Packaged Water",
    "Fruit Beverages",
    "Energy Drinks",
    "Dairy Products",
    "Snacks",
    "Confectionery"
  ]);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      sku: "",
      description: "",
      category: "",
      mrp: "",
      distributorPrice: "",
      superstockistPrice: "",
      minStock: "",
      packSize: "",
      unitType: "units",
      isActive: true,
      image: null
    }
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        sku: product.sku,
        description: product.description,
        category: product.category,
        mrp: product.mrp,
        distributorPrice: product.distributorPrice,
        superstockistPrice: product.superstockistPrice,
        minStock: product.minStock,
        packSize: product.packSize,
        unitType: product.unitType || "units",
        isActive: product.isActive
      });
      if (product.image) {
        setImagePreview(product.image);
      }
    }
  }, [product, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === "image" && data[key][0]) {
          formData.append(key, data[key][0]);
        } else {
          formData.append(key, data[key]);
        }
      });
      
      await onSubmit(formData);
      toast.success(product ? "Product updated successfully" : "Product created successfully");
      if (!product) {
        reset();
        setImagePreview(null);
      }
    } catch (error) {
      toast.error("Error saving product. Please try again.");
      console.error("Error saving product:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        {/* Basic Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                {...register("name", { 
                  required: "Product name is required",
                  minLength: {
                    value: 3,
                    message: "Product name must be at least 3 characters"
                  }
                })}
                className={`mt-1 block w-full rounded-md ${
                  errors.name ? "border-red-300" : "border-gray-300"
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU *
              </label>
              <input
                type="text"
                {...register("sku", { 
                  required: "SKU is required",
                  pattern: {
                    value: /^[A-Za-z0-9-]+$/,
                    message: "SKU can only contain letters, numbers, and hyphens"
                  }
                })}
                className={`mt-1 block w-full rounded-md ${
                  errors.sku ? "border-red-300" : "border-gray-300"
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              />
              {errors.sku && (
                <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className={`mt-1 block w-full rounded-md ${
                  errors.category ? "border-red-300" : "border-gray-300"
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pack Size
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  {...register("packSize", {
                    min: {
                      value: 1,
                      message: "Pack size must be greater than 0"
                    }
                  })}
                  className="flex-1 min-w-0 block w-full rounded-none rounded-l-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                <select
                  {...register("unitType")}
                  className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                >
                  <option value="units">units</option>
                  <option value="ml">ml</option>
                  <option value="L">L</option>
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MRP *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  {...register("mrp", {
                    required: "MRP is required",
                    min: {
                      value: 0,
                      message: "MRP must be greater than 0"
                    }
                  })}
                  className={`mt-1 block w-full pl-7 rounded-md ${
                    errors.mrp ? "border-red-300" : "border-gray-300"
                  } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                />
              </div>
              {errors.mrp && (
                <p className="mt-1 text-sm text-red-600">{errors.mrp.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Superstockist Price *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  {...register("superstockistPrice", {
                    required: "Superstockist price is required",
                    min: {
                      value: 0,
                      message: "Price must be greater than 0"
                    }
                  })}
                  className={`mt-1 block w-full pl-7 rounded-md ${
                    errors.superstockistPrice ? "border-red-300" : "border-gray-300"
                  } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                />
              </div>
              {errors.superstockistPrice && (
                <p className="mt-1 text-sm text-red-600">{errors.superstockistPrice.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distributor Price *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  {...register("distributorPrice", {
                    required: "Distributor price is required",
                    min: {
                      value: 0,
                      message: "Price must be greater than 0"
                    }
                  })}
                  className={`mt-1 block w-full pl-7 rounded-md ${
                    errors.distributorPrice ? "border-red-300" : "border-gray-300"
                  } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                />
              </div>
              {errors.distributorPrice && (
                <p className="mt-1 text-sm text-red-600">{errors.distributorPrice.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Inventory Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Stock Level *
              </label>
              <input
                type="number"
                {...register("minStock", {
                  required: "Minimum stock level is required",
                  min: {
                    value: 0,
                    message: "Minimum stock must be 0 or greater"
                  }
                })}
                className={`mt-1 block w-full rounded-md ${
                  errors.minStock ? "border-red-300" : "border-gray-300"
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              />
              {errors.minStock && (
                <p className="mt-1 text-sm text-red-600">{errors.minStock.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Status
              </label>
              <Controller
                name="isActive"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Switch
                    checked={value}
                    onChange={onChange}
                    className={`${
                      value ? "bg-primary-600" : "bg-gray-200"
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                  >
                    <span className="sr-only">Product status</span>
                    <span
                      aria-hidden="true"
                      className={`${
                        value ? "translate-x-5" : "translate-x-0"
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </Switch>
                )}
              />
              <p className="mt-1 text-sm text-gray-500">
                {control._formValues.isActive ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>

        {/* Product Image */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Product Image</h3>
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="h-32 w-32 rounded-lg border border-gray-200 overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><rect x="24" y="64" width="176" height="128" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="200 112 244 80 244 176 200 144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="mt-1">
                <input
                  type="file"
                  {...register("image")}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="product-image"
                />
                <label
                  htmlFor="product-image"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer"
                >
                  <span className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18"><rect width="256" height="256" fill="none"/><circle cx="188" cy="168" r="16"/><path d="M180,128h44a8,8,0,0,1,8,8v64a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V136a8,8,0,0,1,8-8H76" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="128" x2="128" y2="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="80 72 128 24 176 72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  </span>
                  Upload Image
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
            isLoading ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <>
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18"><rect width="256" height="256" fill="none"/><line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="224" y1="128" x2="192" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="195.88" y1="195.88" x2="173.25" y2="173.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="224" x2="128" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="60.12" y1="195.88" x2="82.75" y2="173.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="32" y1="128" x2="64" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="60.12" y1="60.12" x2="82.75" y2="82.75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </span>
              Saving...
            </>
          ) : (
            <>
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18"><rect width="256" height="256" fill="none"/><rect x="48" y="120" width="88" height="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M208,188v12a8,8,0,0,1-8,8H180" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="208" y1="116" x2="208" y2="140" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M184,48h16a8,8,0,0,1,8,8V72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="116" y1="48" x2="140" y2="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M48,76V56a8,8,0,0,1,8-8H68" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </span>
              {product ? "Update Product" : "Create Product"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;