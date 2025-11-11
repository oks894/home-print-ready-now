import { z } from 'zod';

// Email validation
export const emailSchema = z.string().email('Invalid email address').max(255);

// Name validation (letters and spaces only)
export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

// Phone validation (Indian format)
export const phoneSchema = z.string()
  .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number');

// UPI ID validation
export const upiSchema = z.string()
  .regex(/^[\w.-]+@[\w]+$/, 'Invalid UPI ID format');

// Sanitize text input (basic XSS prevention)
export const sanitizeText = (text: string): string => {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Allowed file types
export const allowedFileTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'text/plain'
];

export const allowedFileExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.txt'];

// Validate file type
export const validateFileType = (file: File): boolean => {
  return allowedFileTypes.includes(file.type);
};

// Validate file size (20MB max)
export const validateFileSize = (file: File, maxSizeMB: number = 20): boolean => {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Validate amount
export const amountSchema = z.number()
  .positive('Amount must be positive')
  .max(100000, 'Amount too large');
