import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Switch } from "@headlessui/react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import toast from "react-hot-toast";

const DistributorForm = ({ distributor, onSubmit, isLoading }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [showGSTFields, setShowGSTFields] = useState(false);
  const [territories, setTerritories] = useState([]);

  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      businessName: "",
      ownerName: "",
      phone: "",
      alternatePhone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      hasGST: false,
      gstNumber: "",
      panNumber: "",
      territory: "",
      creditLimit: 0,
      paymentTerms: "15days",
      depositAmount: 0,
      guarantorName: "",
      guarantorPhone: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      status: true,
      logo: null,
      notes: ""
    }
  });

  useEffect(() => {
    // Simulated API call to fetch territories
    const fetchTerritories = async () => {
      // Replace with actual API call
      const mockTerritories = [
        "North Mumbai",
        "South Mumbai",
        "Thane",
        "Navi Mumbai",
        "Pune Central",
        "Pune West"
      ];
      setTerritories(mockTerritories);
    };

    fetchTerritories();

    if (distributor) {
      reset({
        ...distributor,
        hasGST: Boolean(distributor.gstNumber)
      });
      setShowGSTFields(Boolean(distributor.gstNumber));
      if (distributor.logo) {
        setImagePreview(distributor.logo);
      }
    }
  }, [distributor, reset]);

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

  const handleGSTToggle = (checked) => {
    setShowGSTFields(checked);
    setValue("hasGST", checked);
    if (!checked) {
      setValue("gstNumber", "");
      setValue("panNumber", "");
    }
  };

  const validateGSTNumber = (value) => {
    if (showGSTFields && !value) {
      return "GST number is required when GST is enabled";
    }
    if (value && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value)) {
      return "Invalid GST number format";
    }
    return true;
  };

  const validatePANNumber = (value) => {
    if (showGSTFields && !value) {
      return "PAN number is required when GST is enabled";
    }
    if (value && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
      return "Invalid PAN number format";
    }
    return true;
  };

  const handleFormSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === "logo" && data[key][0]) {
          formData.append(key, data[key][0]);
        } else {
          formData.append(key, data[key]);
        }
      });

      await onSubmit(formData);
      toast.success(distributor ? "Distributor updated successfully" : "Distributor created successfully");
      
      if (!distributor) {
        reset();
        setImagePreview(null);
        setShowGSTFields(false);
      }
    } catch (error) {
      console.error("Error saving distributor:", error);
      toast.error("Error saving distributor. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        {/* Business Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name *
              </label>
              <input
                type="text"
                {...register("businessName", {
                  required: "Business name is required",
                  minLength: {
                    value: 3,
                    message: "Business name must be at least 3 characters"
                  }
                })}
                className={`mt-1 block w-full rounded-md ${
                  errors.businessName ? "border-red-300" : "border-gray-300"
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              />
              {errors.businessName && (
                <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Owner Name *
              </label>
              <input
                type="text"
                {...register("ownerName", {
                  required: "Owner name is required"
                })}
                className={`mt-1 block w-full rounded-md ${
                  errors.ownerName ? "border-red-300" : "border-gray-300"
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              />
              {errors.ownerName && (
                <p className="mt-1 text-sm text-red-600">{errors.ownerName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <Controller
                name="phone"
                control={control}
                rules={{ required: "Phone number is required" }}
                render={({ field }) => (
                  <PhoneInput
                    country="in"
                    value={field.value}
                    onChange={phone => field.onChange(phone)}
                    inputClass={`!w-full !py-2 !px-3 !text-base ${
                      errors.phone ? "!border-red-300" : ""
                    }`}
                  />
                )}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alternate Phone
              </label>
              <Controller
                name="alternatePhone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    country="in"
                    value={field.value}
                    onChange={phone => field.onChange(phone)}
                    inputClass="!w-full !py-2 !px-3 !text-base"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register("email", {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Territory *
              </label>
              <select
                {...register("territory", { required: "Territory is required" })}
                className={`mt-1 block w-full rounded-md ${
                  errors.territory ? "border-red-300" : "border-gray-300"
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              >
                <option value="">Select Territory</option>
                {territories.map(territory => (
                  <option key={territory} value={territory}>
                    {territory}
                  </option>
                ))}
              </select>
              {errors.territory && (
                <p className="mt-1 text-sm text-red-600">{errors.territory.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                {...register("address", { required: "Address is required" })}
                rows={3}
                className={`mt-1 block w-full rounded-md ${
                  errors.address ? "border-red-300" : "border-gray-300"
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                {...register("city", { required: "City is required" })}
                className={`mt-1 block w-full rounded-md ${
                  errors.city ? "border-red-300" : "border-gray-300"
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                {...register("state", { required: "State is required" })}
                className={`mt-1 block w-full rounded-md ${
                  errors.state ? "border-red-300" : "border-gray-300"
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PIN Code *
              </label>
              <input
                type="text"
                {...register("pincode", {
                  required: "PIN code is required",
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "Invalid PIN code"
                  }
                })}
                className={`mt-1 block w-full rounded-md ${
                  errors.pincode ? "border-red-300" : "border-gray-300"
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              />
              {errors.pincode && (
                <p className="mt-1 text-sm text-red-600">{errors.pincode.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* GST Information */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">GST Information</h3>
            <Controller
              name="hasGST"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch
                  checked={value}
                  onChange={(checked) => {
                    onChange(checked);
                    handleGSTToggle(checked);
                  }}
                  className={`${
                    value ? "bg-primary-600" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                >
                  <span className="sr-only">Enable GST</span>
                  <span
                    aria-hidden="true"
                    className={`${
                      value ? "translate-x-5" : "translate-x-0"
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </Switch>
              )}
            />
          </div>

          {showGSTFields && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GST Number *
                </label>
                <input
                  type="text"
                  {...register("gstNumber", {
                    validate: validateGSTNumber
                  })}
                  className={`mt-1 block w-full rounded-md ${
                    errors.gstNumber ? "border-red-300" : "border-gray-300"
                  } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm uppercase`}
                />
                {errors.gstNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.gstNumber.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PAN Number *
                </label>
                <input
                  type="text"
                  {...register("panNumber", {
                    validate: validatePANNumber
                  })}
                  className={`mt-1 block w-full rounded-md ${
                    errors.panNumber ? "border-red-300" : "border-gray-300"
                  } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm uppercase`}
                />
                {errors.panNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.panNumber.message}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Financial Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credit Limit *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  {...register("creditLimit", {
                    required: "Credit limit is required",
                    min: {
                      value: 0,
                      message: "Credit limit cannot be negative"
                    }
                  })}
                  className={`mt-1 block w-full pl-7 rounded-md ${
                    errors.creditLimit ? "border-red-300" : "border-gray-300"
                  } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                />
              </div>
              {errors.creditLimit && (
                <p className="mt-1 text-sm text-red-600">{errors.creditLimit.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Terms *
              </label>
              <select
                {...register("paymentTerms", { required: "Payment terms is required" })}
                className={`mt-1 block w-full rounded-md ${
                  errors.paymentTerms ? "border-red-300" : "border-gray-300"
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              >
                <option value="cod">Cash on Delivery</option>
                <option value="7days">7 Days Credit</option>
                <option value="15days">15 Days Credit</option>
                <option value="30days">30 Days Credit</option>
              </select>
              {errors.paymentTerms && (
                <p className="mt-1 text-sm text-red-600">{errors.paymentTerms.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Security Deposit
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  {...register("depositAmount", {
                    min: {
                      value: 0,
                      message: "Deposit amount cannot be negative"
                    }
                  })}
                  className="mt-1 block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Guarantor Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Guarantor Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guarantor Name
              </label>
              <input
                type="text"
                {...register("guarantorName")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guarantor Phone
              </label>
              <Controller
                name="guarantorPhone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    country="in"
                    value={field.value}
                    onChange={phone => field.onChange(phone)}
                    inputClass="!w-full !py-2 !px-3 !text-base"
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                {...register("bankName")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                {...register("accountNumber", {
                  pattern: {
                    value: /^[0-9]{9,18}$/,
                    message: "Invalid account number"
                  }
                })}
                className={`mt-1 block w-full rounded-md ${
                  errors.accountNumber ? "border-red-300" : "border-gray-300"
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              />
              {errors.accountNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.accountNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                {...register("ifscCode", {
                  pattern: {
                    value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                    message: "Invalid IFSC code"
                  }
                })}
                className={`mt-1 block w-full rounded-md ${
                  errors.ifscCode ? "border-red-300" : "border-gray-300"
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm uppercase`}
              />
              {errors.ifscCode && (
                <p className="mt-1 text-sm text-red-600">{errors.ifscCode.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Business Logo */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Business Logo</h3>
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="h-32 w-32 rounded-lg border border-gray-200 overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Business logo preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="16" y1="216" x2="240" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="224 216 224 76 176 76 176 40 80 40 80 112 32 112 32 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="76" x2="136" y2="76" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="112" x2="136" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="112" x2="188" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="68" y1="148" x2="84" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="148" x2="136" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="148" x2="188" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M148,216V176a4,4,0,0,0-4-4H112a4,4,0,0,0-4,4v40Z"/></svg>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <input
                type="file"
                {...register("logo")}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer"
              >
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18"><rect width="256" height="256" fill="none"/><circle cx="188" cy="168" r="16"/><path d="M180,128h44a8,8,0,0,1,8,8v64a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V136a8,8,0,0,1,8-8H76" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="128" x2="128" y2="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="80 72 128 24 176 72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                </span>
                Upload Logo
              </label>
              <p className="mt-2 text-sm text-gray-500">
                PNG, JPG up to 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            {...register("notes")}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="Any additional information about the distributor..."
          />
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
                  <span className="sr-only">Distributor status</span>
                  <span
                    aria-hidden="true"
                    className={`${
                      value ? "translate-x-5" : "translate-x-0"
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </Switch>
              )}
            />
            <span className="ml-3 text-sm font-medium text-gray-700">
              Active Distributor
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
              {distributor ? "Update Distributor" : "Create Distributor"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default DistributorForm;