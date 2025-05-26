/**
 * Form validation utility functions for the Froscia DMS application
 */

/**
 * Validates an email address
 * @param {string} email - The email address to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validates a phone number (Indian format)
 * @param {string} phone - The phone number to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates a GST number
 * @param {string} gst - The GST number to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidGST = (gst) => {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst);
};

/**
 * Validates a PAN number
 * @param {string} pan - The PAN number to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidPAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

/**
 * Validates a PIN code
 * @param {string|number} pincode - The PIN code to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidPincode = (pincode) => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(String(pincode));
};

/**
 * Validates if a password meets minimum security requirements
 * @param {string} password - The password to validate
 * @returns {object} Validation result with status and message
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long"
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter"
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter"
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number"
    };
  }

  if (!/[!@#$%^&*]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character (!@#$%^&*)"
    };
  }

  return {
    isValid: true,
    message: "Password meets all requirements"
  };
};

/**
 * Validates if a number is within a given range
 * @param {number} value - The value to check
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {boolean} True if within range, false otherwise
 */
export const isInRange = (value, min, max) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Validates product quantity against minimum order quantity and available stock
 * @param {number} quantity - Quantity to validate
 * @param {number} minOrderQty - Minimum order quantity
 * @param {number} availableStock - Available stock
 * @returns {object} Validation result with status and message
 */
export const validateOrderQuantity = (quantity, minOrderQty, availableStock) => {
  const qty = Number(quantity);

  if (isNaN(qty)) {
    return {
      isValid: false,
      message: "Please enter a valid number"
    };
  }

  if (qty < minOrderQty) {
    return {
      isValid: false,
      message: `Minimum order quantity is ${minOrderQty} units`
    };
  }

  if (qty > availableStock) {
    return {
      isValid: false,
      message: `Only ${availableStock} units available in stock`
    };
  }

  return {
    isValid: true,
    message: "Valid quantity"
  };
};

/**
 * Validates a date against a minimum and maximum date
 * @param {string|Date} date - The date to validate
 * @param {string|Date} minDate - Minimum allowed date
 * @param {string|Date} maxDate - Maximum allowed date
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidDate = (date, minDate, maxDate) => {
  const d = new Date(date);
  const min = new Date(minDate);
  const max = new Date(maxDate);

  return !isNaN(d.getTime()) && d >= min && d <= max;
};

/**
 * Validates a credit limit based on business rules
 * @param {number} creditLimit - Proposed credit limit
 * @param {number} averageMonthlyPurchase - Average monthly purchase amount
 * @returns {object} Validation result with status and message
 */
export const validateCreditLimit = (creditLimit, averageMonthlyPurchase) => {
  const limit = Number(creditLimit);
  const avgPurchase = Number(averageMonthlyPurchase);

  if (isNaN(limit) || limit < 0) {
    return {
      isValid: false,
      message: "Please enter a valid credit limit"
    };
  }

  if (limit > avgPurchase * 2) {
    return {
      isValid: false,
      message: "Credit limit cannot exceed twice the average monthly purchase"
    };
  }

  return {
    isValid: true,
    message: "Valid credit limit"
  };
};

/**
 * Validates retailer information
 * @param {object} retailer - Retailer information object
 * @returns {object} Validation result with errors for each field
 */
export const validateRetailer = (retailer) => {
  const errors = {};

  if (!retailer.businessName || retailer.businessName.trim().length < 3) {
    errors.businessName = "Business name must be at least 3 characters long";
  }

  if (!retailer.ownerName || retailer.ownerName.trim().length < 3) {
    errors.ownerName = "Owner name must be at least 3 characters long";
  }

  if (!isValidPhone(retailer.phone)) {
    errors.phone = "Please enter a valid phone number";
  }

  if (!isValidGST(retailer.gst)) {
    errors.gst = "Please enter a valid GST number";
  }

  if (!retailer.address || retailer.address.trim().length < 10) {
    errors.address = "Please enter a complete address";
  }

  if (!isValidPincode(retailer.pincode)) {
    errors.pincode = "Please enter a valid PIN code";
  }

  if (retailer.email && !isValidEmail(retailer.email)) {
    errors.email = "Please enter a valid email address";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates payment information
 * @param {object} payment - Payment information object
 * @returns {object} Validation result with errors for each field
 */
export const validatePayment = (payment) => {
  const errors = {};

  if (!payment.amount || isNaN(payment.amount) || payment.amount <= 0) {
    errors.amount = "Please enter a valid payment amount";
  }

  if (!payment.paymentMode) {
    errors.paymentMode = "Please select a payment mode";
  }

  if (payment.paymentMode === "cheque") {
    if (!payment.bankName) {
      errors.bankName = "Please enter bank name";
    }
    
    if (!payment.chequeNumber || !/^\d{6}$/.test(payment.chequeNumber)) {
      errors.chequeNumber = "Please enter a valid 6-digit cheque number";
    }
    
    if (!payment.chequeDate) {
      errors.chequeDate = "Please enter cheque date";
    } else {
      const chequeDate = new Date(payment.chequeDate);
      const today = new Date();
      if (chequeDate < today) {
        errors.chequeDate = "Cheque date cannot be in the past";
      }
    }
  }

  if (payment.paymentMode === "online" && !payment.transactionId) {
    errors.transactionId = "Please enter transaction ID";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates order information
 * @param {object} order - Order information object
 * @returns {object} Validation result with errors for each field
 */
export const validateOrder = (order) => {
  const errors = {};

  if (!order.retailerId) {
    errors.retailerId = "Please select a retailer";
  }

  if (!order.items || order.items.length === 0) {
    errors.items = "Please add at least one item to the order";
  }

  if (!order.deliveryDate) {
    errors.deliveryDate = "Please select delivery date";
  } else {
    const deliveryDate = new Date(order.deliveryDate);
    const today = new Date();
    if (deliveryDate < today) {
      errors.deliveryDate = "Delivery date cannot be in the past";
    }
  }

  if (!order.paymentType) {
    errors.paymentType = "Please select payment type";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates scheme information
 * @param {object} scheme - Scheme information object
 * @returns {object} Validation result with errors for each field
 */
export const validateScheme = (scheme) => {
  const errors = {};

  if (!scheme.name || scheme.name.trim().length < 3) {
    errors.name = "Please enter a valid scheme name";
  }

  if (!scheme.startDate) {
    errors.startDate = "Please select start date";
  }

  if (!scheme.endDate) {
    errors.endDate = "Please select end date";
  }

  if (scheme.startDate && scheme.endDate) {
    const start = new Date(scheme.startDate);
    const end = new Date(scheme.endDate);
    if (end <= start) {
      errors.endDate = "End date must be after start date";
    }
  }

  if (!scheme.type) {
    errors.type = "Please select scheme type";
  }

  if (scheme.type === "quantity") {
    if (!scheme.buyQty || scheme.buyQty < 1) {
      errors.buyQty = "Please enter valid buy quantity";
    }
    if (!scheme.getQty || scheme.getQty < 1) {
      errors.getQty = "Please enter valid free quantity";
    }
  }

  if (scheme.type === "discount") {
    if (!scheme.discountPercent || scheme.discountPercent <= 0 || scheme.discountPercent > 100) {
      errors.discountPercent = "Please enter valid discount percentage (1-100)";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};