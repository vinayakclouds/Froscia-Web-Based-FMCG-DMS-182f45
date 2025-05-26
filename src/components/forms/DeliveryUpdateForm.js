import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import toast from "react-hot-toast";

const DeliveryUpdateForm = ({ order, onUpdate, onCancel }) => {
  const [deliveryStatus, setDeliveryStatus] = useState(order?.deliveryStatus || "pending");
  const [deliveryDate, setDeliveryDate] = useState(order?.deliveryDate || "");
  const [deliveryTime, setDeliveryTime] = useState(order?.deliveryTime || "");
  const [receiverName, setReceiverName] = useState(order?.receiverName || "");
  const [receiverPhone, setReceiverPhone] = useState(order?.receiverPhone || "");
  const [deliveryNotes, setDeliveryNotes] = useState(order?.deliveryNotes || "");
  const [proofOfDelivery, setProofOfDelivery] = useState(null);
  const [signature, setSignature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  useEffect(() => {
    if (order) {
      setDeliveryStatus(order.deliveryStatus || "pending");
      setDeliveryDate(order.deliveryDate || "");
      setDeliveryTime(order.deliveryTime || "");
      setReceiverName(order.receiverName || "");
      setReceiverPhone(order.receiverPhone || "");
      setDeliveryNotes(order.deliveryNotes || "");
    }
  }, [order]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!receiverName || !receiverPhone) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("orderId", order.id);
      formData.append("deliveryStatus", deliveryStatus);
      formData.append("deliveryDate", deliveryDate);
      formData.append("deliveryTime", deliveryTime);
      formData.append("receiverName", receiverName);
      formData.append("receiverPhone", receiverPhone);
      formData.append("deliveryNotes", deliveryNotes);
      
      if (proofOfDelivery) {
        formData.append("proofOfDelivery", proofOfDelivery);
      }
      
      if (signature) {
        formData.append("signature", signature);
      }

      await onUpdate(formData);
      toast.success("Delivery status updated successfully");

    } catch (error) {
      console.error("Error updating delivery status:", error);
      toast.error("Failed to update delivery status");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      setProofOfDelivery(file);
    }
  };

  const handleSignatureCapture = () => {
    // Simulated signature capture
    const mockSignatureData = "signature_data";
    setSignature(mockSignatureData);
    setShowSignaturePad(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Details Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Order #{order.orderNumber}</h4>
            <p className="text-sm text-gray-500">
              {format(new Date(order.orderDate), "PPP")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              ₹{order.totalAmount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              {order.items.length} items
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Delivery To:</p>
              <p className="text-sm text-gray-900">{order.shippingAddress.street}</p>
              <p className="text-sm text-gray-900">
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </p>
              <p className="text-sm text-gray-900">{order.shippingAddress.pincode}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Contact:</p>
              <p className="text-sm text-gray-900">{order.retailer.name}</p>
              <p className="text-sm text-gray-900">{order.retailer.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Status Update */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Delivery Status *
        </label>
        <select
          value={deliveryStatus}
          onChange={(e) => setDeliveryStatus(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        >
          <option value="pending">Pending</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="failed">Delivery Failed</option>
          <option value="rescheduled">Rescheduled</option>
        </select>
      </div>

      {/* Delivery Date and Time */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Delivery Date *
          </label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Delivery Time *
          </label>
          <input
            type="time"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Receiver Details */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Receiver Name *
          </label>
          <input
            type="text"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            placeholder="Enter receiver's name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Receiver Phone *
          </label>
          <input
            type="tel"
            value={receiverPhone}
            onChange={(e) => setReceiverPhone(e.target.value)}
            placeholder="Enter receiver's phone"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Proof of Delivery */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Proof of Delivery
        </label>
        <div className="mt-1 flex items-center">
          <div className="flex-shrink-0">
            {proofOfDelivery ? (
              <div className="relative h-16 w-16">
                <img
                  src={URL.createObjectURL(proofOfDelivery)}
                  alt="Proof of delivery"
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => setProofOfDelivery(null)}
                  className="absolute -top-2 -right-2 rounded-full bg-red-100 p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="160" y1="96" x2="96" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="96" y1="96" x2="160" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                </button>
              </div>
            ) : (
              <div className="h-16 w-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><rect x="24" y="64" width="176" height="128" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="200 112 244 80 244 176 200 144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="proof-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500"
              >
                <span>Upload a photo</span>
                <input
                  id="proof-upload"
                  name="proof-upload"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="sr-only"
                  onChange={handlePhotoCapture}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG up to 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Digital Signature */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Digital Signature
        </label>
        {signature ? (
          <div className="mt-1 relative">
            <div className="h-32 w-full border rounded-lg flex items-center justify-center bg-gray-50">
              <p className="text-sm text-gray-500">Signature Captured</p>
            </div>
            <button
              type="button"
              onClick={() => setSignature(null)}
              className="absolute top-2 right-2 rounded-full bg-red-100 p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="160" y1="96" x2="96" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="96" y1="96" x2="160" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowSignaturePad(true)}
            className="mt-1 flex justify-center items-center w-full px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><path d="M92.69,216H48a8,8,0,0,1-8-8V163.31a8,8,0,0,1,2.34-5.65L165.66,34.34a8,8,0,0,1,11.31,0L221.66,79a8,8,0,0,1,0,11.31L98.34,213.66A8,8,0,0,1,92.69,216Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="136" y1="64" x2="192" y2="120" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="104" y1="208" x2="48" y2="152" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="164 200 204 160 192 120" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            <span className="ml-2">Capture Signature</span>
          </button>
        )}
      </div>

      {/* Delivery Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Delivery Notes
        </label>
        <textarea
          value={deliveryNotes}
          onChange={(e) => setDeliveryNotes(e.target.value)}
          rows={3}
          placeholder="Enter any additional notes about the delivery"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
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
          disabled={loading}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="224" y1="128" x2="192" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="195.88" y1="195.88" x2="173.25" y2="173.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="224" x2="128" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="60.12" y1="195.88" x2="82.75" y2="173.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="32" y1="128" x2="64" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="60.12" y1="60.12" x2="82.75" y2="82.75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              <span className="ml-2">Updating...</span>
            </>
          ) : (
            "Update Delivery Status"
          )}
        </button>
      </div>

      {/* Signature Pad Modal */}
      {showSignaturePad && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Capture Signature
                  </h3>
                  <div className="mt-2">
                    <div className="border-2 border-gray-300 rounded-lg h-64 flex items-center justify-center">
                      <p className="text-sm text-gray-500">
                        Signature pad will be rendered here
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={handleSignatureCapture}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                >
                  Save Signature
                </button>
                <button
                  type="button"
                  onClick={() => setShowSignaturePad(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

DeliveryUpdateForm.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.string.isRequired,
    orderNumber: PropTypes.string.isRequired,
    orderDate: PropTypes.string.isRequired,
    totalAmount: PropTypes.number.isRequired,
    items: PropTypes.array.isRequired,
    shippingAddress: PropTypes.shape({
      street: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      pincode: PropTypes.string.isRequired
    }).isRequired,
    retailer: PropTypes.shape({
      name: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired
    }).isRequired,
    deliveryStatus: PropTypes.string,
    deliveryDate: PropTypes.string,
    deliveryTime: PropTypes.string,
    receiverName: PropTypes.string,
    receiverPhone: PropTypes.string,
    deliveryNotes: PropTypes.string
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default DeliveryUpdateForm;