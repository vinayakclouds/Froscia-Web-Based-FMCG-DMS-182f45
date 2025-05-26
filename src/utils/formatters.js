import { format, parseISO, isValid } from "date-fns";

/**
 * Formats a number as currency (INR)
 * @param {number} amount - The amount to format
 * @param {boolean} [showSymbol=true] - Whether to show the ₹ symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, showSymbol = true) => {
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return showSymbol ? formattedAmount : formattedAmount.replace("₹", "").trim();
};

/**
 * Formats a date string to a readable format
 * @param {string} dateString - The date string to format
 * @param {string} [formatString="PP"] - The format string to use (date-fns format)
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, formatString = "PP") => {
  const date = parseISO(dateString);
  return isValid(date) ? format(date, formatString) : "Invalid Date";
};

/**
 * Formats a time string to a readable format
 * @param {string} timeString - The time string to format (HH:mm)
 * @returns {string} Formatted time string
 */
export const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));

  return isValid(date)
    ? format(date, "h:mm a")
    : "Invalid Time";
};

/**
 * Truncates a string to a specified length
 * @param {string} str - The string to truncate
 * @param {number} [maxLength=50] - The maximum length of the string
 * @returns {string} Truncated string
 */
export const truncateString = (str, maxLength = 50) => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
};

/**
 * Formats a number with commas as thousands separators
 * @param {number} number - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (number) => {
  return new Intl.NumberFormat("en-IN").format(number);
};

/**
 * Capitalizes the first letter of each word in a string
 * @param {string} str - The string to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
};

/**
 * Formats a phone number to a readable format
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "+91 " + match[1] + "-" + match[2] + "-" + match[3];
  }
  return phoneNumber;
};

/**
 * Formats a file size in bytes to a human-readable string
 * @param {number} bytes - The file size in bytes
 * @param {number} [decimals=2] - The number of decimal places to show
 * @returns {string} Formatted file size string
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

/**
 * Formats a percentage value
 * @param {number} value - The value to format as percentage
 * @param {number} [decimals=2] - The number of decimal places to show
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 2) => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Formats an address object into a single line string
 * @param {Object} address - The address object
 * @param {string} address.street - Street address
 * @param {string} address.city - City
 * @param {string} address.state - State
 * @param {string} address.zipCode - Zip/Postal code
 * @returns {string} Formatted address string
 */
export const formatAddress = ({ street, city, state, zipCode }) => {
  return `${street}, ${city}, ${state} ${zipCode}`;
};

/**
 * Formats a duration in milliseconds to a readable string
 * @param {number} milliseconds - The duration in milliseconds
 * @returns {string} Formatted duration string
 */
export const formatDuration = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

/**
 * Formats a credit card number by masking all but the last 4 digits
 * @param {string} cardNumber - The credit card number
 * @returns {string} Masked credit card number
 */
export const formatCreditCard = (cardNumber) => {
  const last4Digits = cardNumber.slice(-4);
  const maskedPart = "*".repeat(cardNumber.length - 4);
  return maskedPart + last4Digits;
};