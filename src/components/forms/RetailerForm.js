import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Switch } from "@headlessui/react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import toast from "react-hot-toast";

const RetailerForm = ({ retailer, onSubmit, isLoading }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedBeatDay, setSelectedBeatDay] = useState([]);
  const [showGSTFields, setShowGSTFields] = useState(false);

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
      category: "general",
      beatDays: [],
      creditLimit: 0,
      paymentTerms: "cod",
      status: true,
      shopImage: null,
      latitude: "",
      longitude: "",
      distributorId: "",
      salesmanId: "",
      notes: ""
    }
  });

  useEffect(() => {
    if (retailer) {
      reset({
        ...retailer,
        hasGST: Boolean(retailer.gstNumber)
      });
      setShowGSTFields(Boolean(retailer.gstNumber));
      if (retailer.beatDays) {
        setSelectedBeatDay(retailer.beatDays);
      }
      if (retailer.shopImage) {
        setImagePreview(retailer.shopImage);
      }
    }
  }, [retailer, reset]);

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

  const handleBeatDayToggle = (day) => {
    const updatedDays = selectedBeatDay.includes(day)
      ? selectedBeatDay.filter(d => d !== day)
      : [...selectedBeatDay, day];
    setSelectedBeatDay(updatedDays);
    setValue("beatDays", updatedDays);
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
        if (key === "shopImage" && data[key][0]) {
          formData.append(key, data[key][0]);
        } else if (key === "beatDays") {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });

      await onSubmit(formData);
      toast.success(retailer ? "Retailer updated successfully" : "Retailer created successfully");
      
      if (!retailer) {
        reset();
        setImagePreview(null);
        setSelectedBeatDay([]);
        setShowGSTFields(false);
      }
    } catch (error) {
      console.error("Error saving retailer:", error);
      toast.error("Error saving retailer. Please try again.");
    }
  };

  const beatDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  const retailerCategories = [
    { value: "general", label: "General Store" },
    { value: "supermarket", label: "Supermarket" },
    { value: "convenience", label: "Convenience Store" },
    { value: "medical", label: "Medical Store" },
    { value: "restaurant", label: "Restaurant" },
    { value: "other", label: "Other" }
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        {/* Basic Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
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
                Category *
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className={`mt-1 block w-full rounded-md ${
                  errors.category ? "border-red-300" : "border-gray-300"
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              >
                {retailerCategories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GPS Coordinates
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Latitude"
                  {...register("latitude")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                <input
                  type="text"
                  placeholder="Longitude"
                  {...register("longitude")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
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

        {/* Business Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Business Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credit Limit
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  {...register("creditLimit", {
                    min: {
                      value: 0,
                      message: "Credit limit cannot be negative"
                    }
                  })}
                  className="mt-1 block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              {errors.creditLimit && (
                <p className="mt-1 text-sm text-red-600">{errors.creditLimit.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Terms
              </label>
              <select
                {...register("paymentTerms")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="cod">Cash on Delivery</option>
                <option value="7days">7 Days Credit</option>
                <option value="15days">15 Days Credit</option>
                <option value="30days">30 Days Credit</option>
              </select>
            </div>
          </div>
        </div>

        {/* Beat Days */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Beat Days</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {beatDays.map((day) => (
              <div key={day} className="relative">
                <button
                  type="button"
                  onClick={() => handleBeatDayToggle(day)}
                  className={`w-full py-2 px-4 text-sm font-medium rounded-md ${
                    selectedBeatDay.includes(day)
                      ? "bg-primary-100 text-primary-700 border-primary-200"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  } border`}
                >
                  {day}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Shop Image */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Shop Image</h3>
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="h-32 w-32 rounded-lg border border-gray-200 overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Shop preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><polyline points="48 139.59 48 216 208 216 208 139.59" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M54,40H202a8,8,0,0,1,7.69,5.8L224,96H32L46.34,45.8A8,8,0,0,1,54,40Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M96,96v16a32,32,0,0,1-64,0V96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M160,96v16a32,32,0,0,1-64,0V96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M224,96v16a32,32,0,0,1-64,0V96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <input
                type="file"
                {...register("shopImage")}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="shop-image"
              />
              <label
                htmlFor="shop-image"
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

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            {...register("notes")}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="Any additional information about the retailer..."
          />
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
              {retailer ? "Update Retailer" : "Create Retailer"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default RetailerForm;