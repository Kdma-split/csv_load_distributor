/**
 * Utility functions for data formatting
 */

// Format date to a readable string
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date)) return '';
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Format phone number with country code
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = ('' + phone).replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length > 10) {
    // International format with country code
    const countryCode = cleaned.slice(0, cleaned.length - 10);
    const areaCode = cleaned.slice(cleaned.length - 10, cleaned.length - 7);
    const firstPart = cleaned.slice(cleaned.length - 7, cleaned.length - 4);
    const secondPart = cleaned.slice(cleaned.length - 4);
    
    return `+${countryCode} (${areaCode}) ${firstPart}-${secondPart}`;
  } else if (cleaned.length === 10) {
    // US format
    const areaCode = cleaned.slice(0, 3);
    const firstPart = cleaned.slice(3, 6);
    const secondPart = cleaned.slice(6);
    
    return `(${areaCode}) ${firstPart}-${secondPart}`;
  }
  
  // Return as is if format doesn't match
  return phone;
};

// Truncate long text with ellipsis
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

// Format number with commas for thousands
export const formatNumber = (num) => {
  if (num === undefined || num === null) return '';
  
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};