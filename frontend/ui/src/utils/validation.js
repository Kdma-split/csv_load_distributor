/**
 * Validation utility functions
 */

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation
export const isValidPhoneNumber = (phone) => {
  // Allow for international format with country code
  // Accepts: +1234567890, 1234567890, 123-456-7890, (123) 456-7890, etc.
  const phoneRegex = /^(\+?\d{1,3})?[- ]?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/;
  return phoneRegex.test(phone);
};

// Password strength validation
export const isStrongPassword = (password) => {
  // Minimum 8 characters, at least one uppercase letter, one lowercase letter, and one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

// Validate file type
export const isValidFileType = (file, allowedTypes) => {
  if (!file) return false;
  return allowedTypes.includes(file.type);
};

// Validate form fields
export const validateAgentForm = (values) => {
  const errors = {};

  // Name validation
  if (!values.name || values.name.trim() === '') {
    errors.name = 'Name is required';
  } else if (values.name.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  // Email validation
  if (!values.email || values.email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Invalid email format';
  }

  // Mobile validation
  if (!values.mobile || values.mobile.trim() === '') {
    errors.mobile = 'Mobile number is required';
  } else if (!isValidPhoneNumber(values.mobile)) {
    errors.mobile = 'Invalid mobile number format';
  }

  // Password validation (only for create or when changing password)
  if (values.password !== undefined) {
    if (values.password && values.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (values.password && !isStrongPassword(values.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
  }

  // Confirm password validation
  if (values.password && values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

// CSV validation
export const validateCSVHeaders = (headers, requiredHeaders) => {
  const lowerCaseHeaders = headers.map(h => h.toLowerCase().trim());
  const lowerCaseRequired = requiredHeaders.map(h => h.toLowerCase().trim());
  
  const missingHeaders = lowerCaseRequired.filter(
    header => !lowerCaseHeaders.includes(header)
  );
  
  if (missingHeaders.length > 0) {
    return {
      isValid: false,
      missingHeaders
    };
  }
  
  return {
    isValid: true,
    missingHeaders: []
  };
};