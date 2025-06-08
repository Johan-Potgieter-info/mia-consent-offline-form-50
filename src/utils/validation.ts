// Validation utilities for form inputs

export const validatePhoneNumber = (phone: string): { isValid: boolean; message?: string } => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, message: 'Phone number is required' };
  }

  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Check if it's only digits and has appropriate length (10-15 digits)
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return { isValid: false, message: 'Phone number must be 10-15 digits' };
  }

  // Check if original input contains only allowed characters (digits, spaces, dashes, parentheses, plus)
  const allowedPattern = /^[\d\s\-\(\)\+]+$/;
  if (!allowedPattern.test(phone)) {
    return { isValid: false, message: 'Phone number can only contain digits, spaces, dashes, parentheses, and plus sign' };
  }

  return { isValid: true };
};

export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  if (!email || email.trim() === '') {
    return { isValid: false, message: 'Email is required' };
  }

  // Comprehensive email regex pattern
  const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailPattern.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }

  return { isValid: true };
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Format as needed - keeping it simple for now
  return digitsOnly;
};
