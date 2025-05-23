import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Switch } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

const SchemeForm = ({ scheme, onSubmit, isLoading }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedDistributors, setSelectedDistributors] = useState([]);

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      code: "",
      description: "",
      type: "discount",
      discountType: "percentage",
      discountValue: 0,
      minimumOrderValue: 0,
      minimumOrderQuantity: 0,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      maxRedemptions: 0,
      perCustomerLimit: 0,
      applicableProducts: [],
      applicableDistributors: [],
      termsAndConditions: "",
      status: true,
      image: null
    }
  });

  useEffect(() => {
    if (scheme) {
      reset({
        ...scheme,
        startDate: new Date(scheme.startDate),
        endDate: new Date(scheme.endDate)
      });
      if (scheme.image) {
        setImagePreview(scheme.image);
      }
      setSelectedProducts(scheme.applicableProducts || []);
      setSelectedDistributors(scheme.applicableDistributors || []);
    }
  }, [scheme, reset]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Mock data for products and distributors
  const availableProducts = [
    { id: "1", name: "Premium Cola 2L", sku: "COLA-2L-001" },
    { id: "2", name: "Fruit Juice Mango 1L", sku: "JUICE-MG-1L" },
    { id: "3", name: "Mineral Water 500ml", sku: "WATER-500ML" }
  ];

  const availableDistributors = [
    { id: "1", name: "Global Distribution Co.", code: "DST001" },
    { id: "2", name: "Super Stock Enterprises", code: "SST001" },
    { id: "3", name: "City Distributors", code: "DST002" }
  ];

  const handleProductToggle = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleDistributorToggle = (distributorId) => {
    setSelectedDistributors(prev => 
      prev.includes(distributorId)
        ? prev.filter(id => id !== distributorId)
        : [...prev, distributorId]
    );
  };

  const handleFormSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === "image" && data[key][0]) {
          formData.append(key, data[key][0]);
        } else if (key === "applicableProducts") {
          formData.append(key, JSON.stringify(selectedProducts));
        } else if (key === "applicableDistributors") {
          formData.append(key, JSON.stringify(selectedDistributors));
        } else if (key === "startDate" || key === "endDate") {
          formData.append(key, data[key].toISOString());
        } else {
          formData.append(key, data[key]);
        }
      });

      await onSubmit(formData);
      toast.success(scheme ? "Scheme updated successfully" : "Scheme created successfully");
      
      if (!scheme) {
        reset();
        setImagePreview(null);
        setSelectedProducts([]);
        setSelectedDistributors([]);
      }
    } catch (error) {
      console.error("Error saving scheme:", error);
      toast.error("Error saving scheme. Please try again.");
    }
  };

  const watchType = watch("type");
  const watchDiscountType = watch("discountType");

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        {/* Basic Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scheme Name *
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "Scheme name is required",
                  minLength: {
                    value: 3,
                    message: "Scheme name must be at least 3 characters"
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
                Scheme Code *
              </label>
              <input
                type="text"
                {...register("code", {
                  required: "Scheme code is required",
                  pattern: {
                    value: /^[A-Z0-9-_]+$/,
                    message: "Scheme code must contain only uppercase letters, numbers, hyphens, and underscores"
                  }
                })}
                className={`mt-1 block w-full rounded-md ${
                  errors.code ? "border-red-300" : "border-gray-300"
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm uppercase`}
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters"
                  }
                })}
                rows={3}
                className={`mt-1 block w-full rounded-md ${
                  errors.description ? "border-red-300" : "border-gray-300"
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                placeholder="Describe the scheme and its benefits..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Scheme Configuration */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Scheme Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scheme Type *
              </label>
              <select
                {...register("type", { required: "Scheme type is required" })}
                className={`mt-1 block w-full rounded-md ${
                  errors.type ? "border-red-300" : "border-gray-300"
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              >
                <option value="discount">Discount</option>
                <option value="bogo">Buy One Get One</option>
                <option value="bundle">Bundle Offer</option>
                <option value="cashback">Cashback</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            {watchType === "discount" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type *
                  </label>
                  <select
                    {...register("discountType", { required: "Discount type is required" })}
                    className={`mt-1 block w-full rounded-md ${
                      errors.discountType ? "border-red-300" : "border-gray-300"
                    } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                  {errors.discountType && (
                    <p className="mt-1 text-sm text-red-600">{errors.discountType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">
                        {watchDiscountType === "percentage" ? "%" : "₹"}
                      </span>
                    </div>
                    <input
                      type="number"
                      {...register("discountValue", {
                        required: "Discount value is required",
                        min: {
                          value: 0,
                          message: "Discount value cannot be negative"
                        },
                        max: {
                          value: watchDiscountType === "percentage" ? 100 : 1000000,
                          message: watchDiscountType === "percentage" ? 
                            "Percentage cannot exceed 100" : 
                            "Discount amount cannot exceed 1,000,000"
                        }
                      })}
                      className={`mt-1 block w-full pl-7 rounded-md ${
                        errors.discountValue ? "border-red-300" : "border-gray-300"
                      } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                    />
                  </div>
                  {errors.discountValue && (
                    <p className="mt-1 text-sm text-red-600">{errors.discountValue.message}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Order Value
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  {...register("minimumOrderValue", {
                    min: {
                      value: 0,
                      message: "Minimum order value cannot be negative"
                    }
                  })}
                  className="mt-1 block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              {errors.minimumOrderValue && (
                <p className="mt-1 text-sm text-red-600">{errors.minimumOrderValue.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Order Quantity
              </label>
              <input
                type="number"
                {...register("minimumOrderQuantity", {
                  min: {
                    value: 0,
                    message: "Minimum order quantity cannot be negative"
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
              {errors.minimumOrderQuantity && (
                <p className="mt-1 text-sm text-red-600">{errors.minimumOrderQuantity.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Validity Period */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Validity Period</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <Controller
                name="startDate"
                control={control}
                rules={{ required: "Start date is required" }}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                    className={`mt-1 block w-full rounded-md ${
                      errors.startDate ? "border-red-300" : "border-gray-300"
                    } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                  />
                )}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <Controller
                name="endDate"
                control={control}
                rules={{ required: "End date is required" }}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    dateFormat="dd/MM/yyyy"
                    minDate={watch("startDate")}
                    className={`mt-1 block w-full rounded-md ${
                      errors.endDate ? "border-red-300" : "border-gray-300"
                    } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                  />
                )}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            {showAdvancedOptions ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><path d="M216,112V56a8,8,0,0,0-8-8H48a8,8,0,0,0-8,8v56c0,96,88,120,88,120S216,208,216,112Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="201.97 171.78 128 120 54.03 171.78" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><path d="M216,112V56a8,8,0,0,0-8-8H48a8,8,0,0,0-8,8v56c0,96,88,120,88,120S216,208,216,112Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="201.97 171.78 128 120 54.03 171.78" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            )}
            <span className="ml-2">Advanced Options</span>
          </button>

          {showAdvancedOptions && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Redemptions
                </label>
                <input
                  type="number"
                  {...register("maxRedemptions", {
                    min: {
                      value: 0,
                      message: "Maximum redemptions cannot be negative"
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Set to 0 for unlimited redemptions
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Per Customer Limit
                </label>
                <input
                  type="number"
                  {...register("perCustomerLimit", {
                    min: {
                      value: 0,
                      message: "Per customer limit cannot be negative"
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Set to 0 for unlimited usage per customer
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Applicable Products
                </label>
                <div className="mt-2 border rounded-md divide-y">
                  {availableProducts.map(product => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sku}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleProductToggle(product.id)}
                        className={`ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                          selectedProducts.includes(product.id)
                            ? "bg-primary-600"
                            : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                            selectedProducts.includes(product.id)
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Applicable Distributors
                </label>
                <div className="mt-2 border rounded-md divide-y">
                  {availableDistributors.map(distributor => (
                    <div
                      key={distributor.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{distributor.name}</p>
                        <p className="text-sm text-gray-500">{distributor.code}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDistributorToggle(distributor.id)}
                        className={`ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                          selectedDistributors.includes(distributor.id)
                            ? "bg-primary-600"
                            : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                            selectedDistributors.includes(distributor.id)
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Terms and Conditions
          </label>
          <textarea
            {...register("termsAndConditions")}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="Enter terms and conditions for the scheme..."
          />
        </div>

        {/* Scheme Image */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Scheme Image
          </label>
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="h-32 w-32 rounded-lg border border-gray-200 overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Scheme preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><rect x="80" y="40" width="136" height="136" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="88" r="20"/><path d="M184,176v32a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M108.69,176l65.65-65.66a8,8,0,0,1,11.32,0L216,140.69" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <input
                type="file"
                {...register("image")}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
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

        {/* Status */}
        <div>
          <div className="flex items-center">
            <Controller
              name="status"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch
                  checked={value}
                  onChange={onChange}
                  className={`${
                    value ? "bg-primary-600" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                >
                  <span className="sr-only">Scheme status</span>
                  <span
                    className={`${
                      value ? "translate-x-5" : "translate-x-0"
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </Switch>
              )}
            />
            <span className="ml-3 text-sm font-medium text-gray-700">
              Active Scheme
            </span>
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
              {scheme ? "Update Scheme" : "Create Scheme"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default SchemeForm;