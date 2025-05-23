import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import toast from "react-hot-toast";

const CollectionForm = ({ retailerId, onSubmit, onCancel, existingCollection = null }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [retailer, setRetailer] = useState(null);
  const [outstandingInvoices, setOutstandingInvoices] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState({
    paymentMode: "cash",
    amount: "",
    referenceNumber: "",
    bankName: "",
    chequeDate: "",
    notes: ""
  });

  useEffect(() => {
    const fetchRetailerDetails = async () => {
      try {
        setIsLoading(true);
        // Simulated API call - replace with actual API integration
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Sample retailer data
        const mockRetailer = {
          id: retailerId,
          name: "SuperMart Store",
          ownerName: "Rajesh Kumar",
          phone: "+91 98765 43210",
          address: "123 Main Street, Mumbai",
          creditLimit: 100000,
          currentDue: 45000,
          lastPaymentDate: "2023-10-01",
          image: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxSZXRhaWxlciUyQnN0b3JlJTJCbG9nb3xlbnwwfHx8fDE3NDc5OTI5MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
        };

        // Sample outstanding invoices
        const mockInvoices = [
          {
            id: "INV001",
            invoiceNumber: "INV-2023-001",
            date: "2023-09-15",
            amount: 15000,
            dueAmount: 15000,
            dueDate: "2023-10-15"
          },
          {
            id: "INV002",
            invoiceNumber: "INV-2023-002",
            date: "2023-09-20",
            amount: 18000,
            dueAmount: 18000,
            dueDate: "2023-10-20"
          },
          {
            id: "INV003",
            invoiceNumber: "INV-2023-003",
            date: "2023-09-25",
            amount: 12000,
            dueAmount: 12000,
            dueDate: "2023-10-25"
          }
        ];

        setRetailer(mockRetailer);
        setOutstandingInvoices(mockInvoices);

        // If editing existing collection, populate form
        if (existingCollection) {
          setPaymentDetails({
            paymentMode: existingCollection.paymentMode,
            amount: existingCollection.amount,
            referenceNumber: existingCollection.referenceNumber || "",
            bankName: existingCollection.bankName || "",
            chequeDate: existingCollection.chequeDate || "",
            notes: existingCollection.notes || ""
          });
          setSelectedInvoices(existingCollection.invoices || []);
        }

      } catch (error) {
        console.error("Error fetching retailer details:", error);
        toast.error("Failed to load retailer details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRetailerDetails();
  }, [retailerId, existingCollection]);

  const handleInvoiceSelect = (invoiceId) => {
    setSelectedInvoices(prev => {
      const isSelected = prev.includes(invoiceId);
      if (isSelected) {
        return prev.filter(id => id !== invoiceId);
      } else {
        return [...prev, invoiceId];
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotalSelected = () => {
    return outstandingInvoices
      .filter(inv => selectedInvoices.includes(inv.id))
      .reduce((sum, inv) => sum + inv.dueAmount, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedInvoices.length === 0) {
      toast.error("Please select at least one invoice");
      return;
    }

    if (!paymentDetails.amount || parseFloat(paymentDetails.amount) <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    if (parseFloat(paymentDetails.amount) > calculateTotalSelected()) {
      toast.error("Payment amount cannot exceed total selected invoices");
      return;
    }

    if (paymentDetails.paymentMode === "cheque" && 
        (!paymentDetails.bankName || !paymentDetails.chequeDate)) {
      toast.error("Please fill all cheque details");
      return;
    }

    try {
      setIsLoading(true);

      const formData = {
        retailerId,
        invoices: selectedInvoices,
        ...paymentDetails,
        amount: parseFloat(paymentDetails.amount),
        collectionDate: new Date().toISOString()
      };

      await onSubmit(formData);
      toast.success("Payment recorded successfully");

    } catch (error) {
      console.error("Error submitting payment:", error);
      toast.error("Failed to record payment");
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
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12">
            {retailer.image ? (
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={retailer.image}
                alt={retailer.name}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="16" y1="216" x2="240" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="224 216 224 76 176 76 176 40 80 40 80 112 32 112 32 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="76" x2="136" y2="76" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="112" x2="136" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="112" x2="188" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="68" y1="148" x2="84" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="148" x2="136" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="148" x2="188" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M148,216V176a4,4,0,0,0-4-4H112a4,4,0,0,0-4,4v40Z"/></svg>
              </div>
            )}
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-medium text-gray-900">
              {retailer.name}
            </h3>
            <p className="text-sm text-gray-500">
              {retailer.ownerName} • {retailer.phone}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Credit Limit</p>
            <p className="text-lg font-medium text-gray-900">
              ₹{retailer.creditLimit.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="mt-4 bg-red-50 rounded-md p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><rect x="88" y="88" width="80" height="80" rx="12"/></svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Outstanding Due</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>₹{retailer.currentDue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Outstanding Invoices */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Outstanding Invoices</h4>
        <div className="space-y-2">
          {outstandingInvoices.map(invoice => (
            <div
              key={invoice.id}
              className={`flex items-center p-3 rounded-lg border ${
                selectedInvoices.includes(invoice.id)
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                id={`invoice-${invoice.id}`}
                checked={selectedInvoices.includes(invoice.id)}
                onChange={() => handleInvoiceSelect(invoice.id)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor={`invoice-${invoice.id}`}
                className="ml-3 flex-1 flex items-center justify-between cursor-pointer"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {invoice.invoiceNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {format(new Date(invoice.date), "dd MMM yyyy")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ₹{invoice.dueAmount.toLocaleString()}
                  </p>
                  <p className="text-xs text-red-600">
                    Due: {format(new Date(invoice.dueDate), "dd MMM yyyy")}
                  </p>
                </div>
              </label>
            </div>
          ))}
        </div>

        {selectedInvoices.length > 0 && (
          <div className="mt-4 flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-900">
              Selected Total
            </span>
            <span className="text-lg font-semibold text-primary-600">
              ₹{calculateTotalSelected().toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Payment Details */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Payment Details</h4>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-700">
              Payment Mode *
            </label>
            <select
              id="paymentMode"
              name="paymentMode"
              value={paymentDetails.paymentMode}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="upi">UPI</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                name="amount"
                id="amount"
                value={paymentDetails.amount}
                onChange={handleInputChange}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
                step="0.01"
                min="0"
                max={calculateTotalSelected()}
              />
            </div>
          </div>

          {paymentDetails.paymentMode !== "cash" && (
            <>
              <div>
                <label htmlFor="referenceNumber" className="block text-sm font-medium text-gray-700">
                  Reference Number
                </label>
                <input
                  type="text"
                  name="referenceNumber"
                  id="referenceNumber"
                  value={paymentDetails.referenceNumber}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              {paymentDetails.paymentMode === "cheque" && (
                <>
                  <div>
                    <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      id="bankName"
                      value={paymentDetails.bankName}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="chequeDate" className="block text-sm font-medium text-gray-700">
                      Cheque Date *
                    </label>
                    <input
                      type="date"
                      name="chequeDate"
                      id="chequeDate"
                      value={paymentDetails.chequeDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="mt-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={paymentDetails.notes}
            onChange={handleInputChange}
            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="Add any additional notes about this payment"
          />
        </div>
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
          disabled={isLoading || selectedInvoices.length === 0}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
            (isLoading || selectedInvoices.length === 0) ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="224" y1="128" x2="192" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="195.88" y1="195.88" x2="173.25" y2="173.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="224" x2="128" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="60.12" y1="195.88" x2="82.75" y2="173.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="32" y1="128" x2="64" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="60.12" y1="60.12" x2="82.75" y2="82.75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              <span className="ml-2">Processing...</span>
            </>
          ) : (
            "Record Payment"
          )}
        </button>
      </div>
    </form>
  );
};

CollectionForm.propTypes = {
  retailerId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  existingCollection: PropTypes.shape({
    paymentMode: PropTypes.oneOf(["cash", "cheque", "upi", "bank_transfer"]),
    amount: PropTypes.number,
    referenceNumber: PropTypes.string,
    bankName: PropTypes.string,
    chequeDate: PropTypes.string,
    notes: PropTypes.string,
    invoices: PropTypes.arrayOf(PropTypes.string)
  })
};

export default CollectionForm;