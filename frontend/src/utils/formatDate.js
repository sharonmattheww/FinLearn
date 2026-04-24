/**
 * Format a date string to a readable Indian format.
 * Example: "2024-03-15T00:00:00Z" → "15 March 2024"
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/**
 * Format a number as Indian Rupee currency string.
 * Example: 125000 → "₹1,25,000"
 */
export const formatRupees = (amount) => {
  if (isNaN(amount)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a number with commas (Indian number system).
 * Example: 125000.50 → "1,25,000.50"
 */
export const formatNumber = (num) => {
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
};
