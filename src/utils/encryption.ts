
// Encryption utilities for sensitive data

// Simple encryption/decryption functions
export const encrypt = (text: string): string => {
  try {
    return btoa(encodeURIComponent(text));
  } catch (error) {
    console.warn('Encryption failed, storing as plain text');
    return text;
  }
};

export const decrypt = (encryptedText: string): string => {
  try {
    return decodeURIComponent(atob(encryptedText));
  } catch (error) {
    // If decryption fails, assume it's plain text
    return encryptedText;
  }
};

export const encryptSensitiveFields = (data: any): any => {
  const sensitiveFields = ['patientName', 'idNumber', 'contactNumber', 'email', 'address'];
  const processedData = { ...data };
  
  sensitiveFields.forEach(field => {
    if (processedData[field]) {
      processedData[field] = encrypt(processedData[field]);
    }
  });
  
  return processedData;
};

export const decryptSensitiveFields = (data: any): any => {
  const sensitiveFields = ['patientName', 'idNumber', 'contactNumber', 'email', 'address'];
  const decryptedData = { ...data };
  
  sensitiveFields.forEach(field => {
    if (decryptedData[field] && decryptedData.encrypted) {
      decryptedData[field] = decrypt(decryptedData[field]);
    }
  });
  
  return decryptedData;
};
