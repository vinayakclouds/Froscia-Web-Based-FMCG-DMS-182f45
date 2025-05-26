import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

const StockTransferForm = ({ onSubmit, isLoading, initialData = null }) => {
  const [fromEntityOptions, setFromEntityOptions] = useState([]);
  const [toEntityOptions, setToEntityOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      transferId: "",
      fromEntity: "",
      toEntity: "",
      transferDate: new Date(),
      products: [{ productId: "", quantity: 0, batchNumber: "", expiryDate: null }],
      transportMode: "road",
      vehicleNumber: "",
      driverName: "",
      driverContact: "",
      notes: "",
    }
  });

  useEffect(() => {
    // Fetch entity and product options
    const fetchOptions = async () => {
      try {
        // Simulated API calls - replace with actual API integration
        const entitiesResponse = await fetch("/api/entities");
        const entities = await entitiesResponse.json();
        setFromEntityOptions(entities);
        setToEntityOptions(entities);

        const productsResponse = await fetch("/api/products");
        const products = await productsResponse.json();
        setProductOptions(products);

        // If editing existing transfer, populate form
        if (initialData) {
          reset({
            ...initialData,
            transferDate: new Date(initialData.transferDate),
            products: initialData.products.map(product => ({
              ...product,
              expiryDate: product.expiryDate ? new Date(product.expiryDate) : null
            }))
          });
        }
      } catch (error) {
        console.error("Error fetching options:", error);
        toast.error("Failed to load form data. Please try again.");
      }
    };

    fetchOptions();
  }, [initialData, reset]);

  const watchProducts = watch("products");

  const handleAddProduct = () => {
    setValue("products", [
      ...watchProducts,
      { productId: "", quantity: 0, batchNumber: "", expiryDate: null }
    ]);
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = watchProducts.filter((_, i) => i !== index);
    setValue("products", updatedProducts);
  };

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      toast.success(initialData ? "Stock transfer updated successfully!" : "Stock transfer created successfully!");
      if (!initialData) {
        reset();
      }
    } catch (error) {
      console.error("Error submitting stock transfer:", error);
      toast.error("Failed to submit stock transfer. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transfer ID
            </label>
            <input
              type="text"
              {...register("transferId", { required: "Transfer ID is required" })}
              className={`mt-1 block w-full rounded-md ${
                errors.transferId ? "border-red-300" : "border-gray-300"
              } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
            />
            {errors.transferId && (
              <p className="mt-1 text-sm text-red-600">{errors.transferId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transfer Date
            </label>
            <Controller
              name="transferDate"
              control={control}
              rules={{ required: "Transfer date is required" }}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  className={`mt-1 block w-full rounded-md ${
                    errors.transferDate ? "border-red-300" : "border-gray-300"
                  } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                  dateFormat="dd/MM/yyyy"
                />
              )}
            />
            {errors.transferDate && (
              <p className="mt-1 text-sm text-red-600">{errors.transferDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Entity
            </label>
            <select
              {...register("fromEntity", { required: "From entity is required" })}
              className={`mt-1 block w-full rounded-md ${
                errors.fromEntity ? "border-red-300" : "border-gray-300"
              } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
            >
              <option value="">Select From Entity</option>
              {fromEntityOptions.map((entity) => (
                <option key={entity.id} value={entity.id}>
                  {entity.name}
                </option>
              ))}
            </select>
            {errors.fromEntity && (
              <p className="mt-1 text-sm text-red-600">{errors.fromEntity.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Entity
            </label>
            <select
              {...register("toEntity", { required: "To entity is required" })}
              className={`mt-1 block w-full rounded-md ${
                errors.toEntity ? "border-red-300" : "border-gray-300"
              } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
            >
              <option value="">Select To Entity</option>
              {toEntityOptions.map((entity) => (
                <option key={entity.id} value={entity.id}>
                  {entity.name}
                </option>
              ))}
            </select>
            {errors.toEntity && (
              <p className="mt-1 text-sm text-red-600">{errors.toEntity.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Products</h3>
          {watchProducts.map((product, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product
                  </label>
                  <select
                    {...register(`products.${index}.productId`, { required: "Product is required" })}
                    className={`mt-1 block w-full rounded-md ${
                      errors.products?.[index]?.productId ? "border-red-300" : "border-gray-300"
                    } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                  >
                    <option value="">Select Product</option>
                    {productOptions.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  {errors.products?.[index]?.productId && (
                    <p className="mt-1 text-sm text-red-600">{errors.products[index].productId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    {...register(`products.${index}.quantity`, {
                      required: "Quantity is required",
                      min: { value: 1, message: "Quantity must be at least 1" }
                    })}
                    className={`mt-1 block w-full rounded-md ${
                      errors.products?.[index]?.quantity ? "border-red-300" : "border-gray-300"
                    } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                  />
                  {errors.products?.[index]?.quantity && (
                    <p className="mt-1 text-sm text-red-600">{errors.products[index].quantity.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    {...register(`products.${index}.batchNumber`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <Controller
                    name={`products.${index}.expiryDate`}
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        dateFormat="dd/MM/yyyy"
                        isClearable
                      />
                    )}
                  />
                </div>
              </div>

              {watchProducts.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveProduct(index)}
                  className="mt-2 text-sm text-red-600 hover:text-red-800"
                >
                  Remove Product
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddProduct}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="88" y1="128" x2="168" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="88" x2="128" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            Add Product
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transport Mode
            </label>
            <select
              {...register("transportMode")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="road">Road</option>
              <option value="rail">Rail</option>
              <option value="air">Air</option>
              <option value="sea">Sea</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Number
            </label>
            <input
              type="text"
              {...register("vehicleNumber")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Driver Name
            </label>
            <input
              type="text"
              {...register("driverName")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Driver Contact
            </label>
            <input
              type="text"
              {...register("driverContact")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            {...register("notes")}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
      </div>

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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="224" y1="128" x2="192" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="195.88" y1="195.88" x2="173.25" y2="173.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="224" x2="128" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="60.12" y1="195.88" x2="82.75" y2="173.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="32" y1="128" x2="64" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="60.12" y1="60.12" x2="82.75" y2="82.75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              Saving...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><rect x="48" y="120" width="88" height="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M208,188v12a8,8,0,0,1-8,8H180" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="208" y1="116" x2="208" y2="140" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M184,48h16a8,8,0,0,1,8,8V72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="116" y1="48" x2="140" y2="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M48,76V56a8,8,0,0,1,8-8H68" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              {initialData ? "Update Transfer" : "Create Transfer"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default StockTransferForm;