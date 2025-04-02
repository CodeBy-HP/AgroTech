/**
 * Format a date string or Date object into a localized string
 * @param {string|Date} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
  if (!date) return '';
  
  const defaultOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    ...options
  };
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-IN', defaultOptions).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
}

/**
 * Format a number as Indian Rupees
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '';
  
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `₹${amount}`;
  }
}

/**
 * Format farm status for display
 * @param {string} status - The farm status
 * @returns {string} Formatted status text
 */
export function formatFarmStatus(status) {
  switch (status) {
    case 'growing':
      return 'Growing';
    case 'harvested':
      return 'Harvested';
    case 'empty':
      return 'Empty';
    default:
      return status ? String(status).charAt(0).toUpperCase() + String(status).slice(1) : 'Unknown';
  }
}

/**
 * Format bid status for display
 * @param {string} status - The bid status
 * @returns {string} Formatted status text
 */
export function formatBidStatus(status) {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'accepted':
      return 'Accepted';
    case 'rejected':
      return 'Rejected';
    case 'completed':
      return 'Completed';
    default:
      return status ? String(status).charAt(0).toUpperCase() + String(status).slice(1) : 'Unknown';
  }
}

/**
 * Truncate text with ellipsis if it exceeds maxLength
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}; 