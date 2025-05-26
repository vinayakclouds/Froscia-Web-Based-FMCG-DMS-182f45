import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Switch } from "@headlessui/react";
import { format } from "date-fns";

const TargetForm = ({ target, onSubmit, isLoading }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [periodType, setPeriodType] = useState("monthly");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      type: "revenue", // revenue or volume
      targetValue: 0,
      periodType: "monthly",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      assignedTo: [],
      assigneeType: "salesperson", // salesperson or distributor
      incentiveType: "percentage",
      incentiveValue: 0,
      minimumAchievement: 75,
      status: true,
      notes: ""
    }
  });

  useEffect(() => {
    if (target) {
      reset({
        ...target,
        startDate: new Date(target.startDate),
        endDate: new Date(target.endDate)
      });
      setSelectedUsers(target.assignedTo || []);
      setPeriodType(target.periodType || "monthly");
    }
  }, [target, reset]);

  // Sample user data for assignment
  const availableUsers = [
    {
      id: "1",
      name: "John Smith",
      code: "SLS001",
      type: "salesperson",
      region: "North",
      image: "https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxTYWxlc3BlcnNvbiUyQnByb2ZpbGUlMkJwaG90b3xlbnwwfHx8fDE3NDc5OTAyMTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: "2",
      name: "Global Distribution Co.",
      code: "DST001",
      type: "distributor",
      region: "South",
      image: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxEaXN0cmlidXRvciUyQmNvbXBhbnklMkJsb2dvfGVufDB8fHx8MTc0Nzk5MDIxM3ww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  const handleUserToggle = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handlePeriodTypeChange = (value) => {
    setPeriodType(value);
    
    // Adjust end date based on period type
    const startDate = watch("startDate");
    let endDate = new Date(startDate);
    
    switch (value) {
      case "weekly":
        endDate.setDate(startDate.getDate() + 6);
        break;
      case "monthly":
        endDate.setMonth(startDate.getMonth() + 1);
        break;
      case "quarterly":
        endDate.setMonth(startDate.getMonth() + 3);
        break;
      case "yearly":
        endDate.setFullYear(startDate.getFullYear() + 1);
        break;
      default:
        break;
    }
    
    setValue("endDate", endDate);
  };

  const calculateProRatedTarget = (targetValue, startDate, endDate) => {
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const monthDays = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
    return Math.round((targetValue / monthDays) * days);
  };

  const handleFormSubmit = async (data) => {
    try {
      // Add selected users to form data
      const formData = {
        ...data,
        assignedTo: selectedUsers,
        proRatedValue: calculateProRatedTarget(
          data.targetValue,
          data.startDate,
          data.endDate
        )
      };
      
      await onSubmit(formData);
      
      if (!target) {
        reset();
        setSelectedUsers([]);
      }
    } catch (error) {
      console.error("Error saving target:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        {/* Basic Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Target Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters"
                  }
                })}
                className={`mt-1 block w-full rounded-md ${
                  errors.title ? "border-red-300" : "border-gray-300"
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                placeholder="e.g., Q4 Sales Target 2023"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Type *
              </label>
              <select
                {...register("type", { required: "Target type is required" })}
                className={`mt-1 block w-full rounded-md ${
                  errors.type ? "border-red-300" : "border-gray-300"
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              >
                <option value="revenue">Revenue Target</option>
                <option value="volume">Volume Target</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Value *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">
                    {watch("type") === "revenue" ? "₹" : "#"}
                  </span>
                </div>
                <input
                  type="number"
                  {...register("targetValue", {
                    required: "Target value is required",
                    min: {
                      value: 1,
                      message: "Target value must be greater than 0"
                    }
                  })}
                  className={`mt-1 block w-full pl-7 rounded-md ${
                    errors.targetValue ? "border-red-300" : "border-gray-300"
                  } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                  placeholder={watch("type") === "revenue" ? "Enter amount" : "Enter quantity"}
                />
              </div>
              {errors.targetValue && (
                <p className="mt-1 text-sm text-red-600">{errors.targetValue.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Period Type *
              </label>
              <select
                value={periodType}
                onChange={(e) => handlePeriodTypeChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
        </div>

        {/* Period Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Target Period</h3>
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
                    onChange={(date) => {
                      field.onChange(date);
                      handlePeriodTypeChange(periodType);
                    }}
                    dateFormat="dd/MM/yyyy"
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

        {/* Target Assignment */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Target Assignment</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignee Type *
              </label>
              <select
                {...register("assigneeType", { required: "Assignee type is required" })}
                className={`mt-1 block w-full rounded-md ${
                  errors.assigneeType ? "border-red-300" : "border-gray-300"
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              >
                <option value="salesperson">Salesperson</option>
                <option value="distributor">Distributor</option>
              </select>
              {errors.assigneeType && (
                <p className="mt-1 text-sm text-red-600">{errors.assigneeType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign To *
              </label>
              <div className="mt-2 border rounded-md divide-y">
                {availableUsers
                  .filter(user => user.type === watch("assigneeType"))
                  .map(user => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="120" r="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M57.78,216a72,72,0,0,1,140.44,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">
                            {user.code} - {user.region} Region
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUserToggle(user.id)}
                        className={`ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                          selectedUsers.includes(user.id)
                            ? "bg-primary-600"
                            : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                            selectedUsers.includes(user.id)
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
              </div>
              {selectedUsers.length === 0 && (
                <p className="mt-1 text-sm text-red-600">
                  Please select at least one {watch("assigneeType")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Incentives */}
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
            <span className="ml-2">Incentive Settings</span>
          </button>

          {showAdvancedOptions && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Incentive Type
                </label>
                <select
                  {...register("incentiveType")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="percentage">Percentage of Achievement</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="slabbed">Slabbed Incentive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Incentive Value
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">
                      {watch("incentiveType") === "percentage" ? "%" : "₹"}
                    </span>
                  </div>
                  <input
                    type="number"
                    {...register("incentiveValue", {
                      min: {
                        value: 0,
                        message: "Incentive value cannot be negative"
                      }
                    })}
                    className="mt-1 block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Achievement %
                </label>
                <input
                  type="number"
                  {...register("minimumAchievement", {
                    min: {
                      value: 0,
                      message: "Minimum achievement cannot be negative"
                    },
                    max: {
                      value: 100,
                      message: "Minimum achievement cannot exceed 100%"
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Minimum percentage required to qualify for incentives
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            {...register("notes")}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="Add any additional notes or instructions..."
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
                  <span className="sr-only">Target status</span>
                  <span
                    className={`${
                      value ? "translate-x-5" : "translate-x-0"
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </Switch>
              )}
            />
            <span className="ml-3 text-sm font-medium text-gray-700">
              Active Target
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
          disabled={isLoading || selectedUsers.length === 0}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
            (isLoading || selectedUsers.length === 0) ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="224" y1="128" x2="192" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="195.88" y1="195.88" x2="173.25" y2="173.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="224" x2="128" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="60.12" y1="195.88" x2="82.75" y2="173.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="32" y1="128" x2="64" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="60.12" y1="60.12" x2="82.75" y2="82.75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              <span className="ml-2">Saving...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><rect x="48" y="120" width="88" height="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M208,188v12a8,8,0,0,1-8,8H180" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="208" y1="116" x2="208" y2="140" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M184,48h16a8,8,0,0,1,8,8V72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="116" y1="48" x2="140" y2="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M48,76V56a8,8,0,0,1,8-8H68" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              <span className="ml-2">{target ? "Update Target" : "Create Target"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default TargetForm;