import { Language } from '../data/weddingData';

export interface RsvpValidationErrors {
  name?: string;
  contact?: string;
  events?: string;
}

export interface RsvpValidationResult {
  isValid: boolean;
  errors: RsvpValidationErrors;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_CHARS_REGEX = /^[\d\s+\-().]+$/;

export function validateGuestName(rawName: string, lang: Language = 'en'): string | null {
  const trimmed = rawName.trim();

  if (!trimmed) {
    return lang === 'en'
      ? 'Please enter your name.'
      : 'कृपया अपना नाम दर्ज करें।';
  }

  if (trimmed.length < 2) {
    return lang === 'en'
      ? 'Name must be at least 2 characters.'
      : 'नाम कम से कम 2 अक्षरों का होना चाहिए।';
  }

  if (trimmed.length > 80) {
    return lang === 'en'
      ? 'Name cannot exceed 80 characters.'
      : 'नाम 80 अक्षरों से अधिक नहीं हो सकता।';
  }

  if (!/[\p{L}]/u.test(trimmed)) {
    return lang === 'en'
      ? 'Please enter a valid name using letters.'
      : 'कृपया अक्षरों में मान्य नाम दर्ज करें।';
  }

  return null;
}

export function validateGuestContact(rawContact: string, lang: Language = 'en'): string | null {
  const trimmed = rawContact.trim();

  // Optional field (like nimantran.page & saath.studio — phone is not mandatory)
  if (!trimmed) {
    return null;
  }

  if (trimmed.includes('@')) {
    if (!EMAIL_REGEX.test(trimmed)) {
      return lang === 'en'
        ? 'Enter a valid email address (e.g. name@example.com).'
        : 'कृपया एक मान्य ईमेल पता दर्ज करें (जैसे name@example.com)।';
    }
    return null;
  }

  if (!PHONE_CHARS_REGEX.test(trimmed)) {
    return lang === 'en'
      ? 'Enter a valid 10-digit phone number or email.'
      : 'कृपया 10 अंकों का मान्य फ़ोन नंबर या ईमेल दर्ज करें।';
  }

  const digits = trimmed.replace(/\D/g, '');

  if (digits.length < 10 || digits.length > 15) {
    return lang === 'en'
      ? 'Enter a valid 10 to 15 digit contact number (e.g. +91 98765 43210).'
      : 'फ़ोन नंबर 10 से 15 अंकों का होना चाहिए (जैसे +91 98765 43210)।';
  }

  // Reject obvious dummy sequences like 0000000000, 9999999999, 1234567890
  const localTen = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
  if (/^(\d)\1+$/.test(localTen) || localTen === '1234567890' || localTen === '0123456789') {
    return lang === 'en'
      ? 'Please enter a real reachable phone number.'
      : 'कृपया एक वास्तविक सक्रिय फ़ोन नंबर दर्ज करें।';
  }

  return null;
}

export function normalizeIndianWhatsappDigits(rawPhone?: string): string {
  const digits = (rawPhone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10 && /^[6-9]/.test(digits)) {
    return `91${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('0') && /^[6-9]/.test(digits.slice(1))) {
    return `91${digits.slice(1)}`;
  }
  return digits;
}

export function validateRsvpForm({
  name,
  contact,
  selectedEventsCount,
  attendanceStatus = 'attending',
  lang = 'en',
}: {
  name: string;
  contact: string;
  selectedEventsCount?: number;
  attendanceStatus?: 'attending' | 'declined';
  lang?: Language;
}): RsvpValidationResult {
  const errors: RsvpValidationErrors = {};

  const nameError = validateGuestName(name, lang);
  if (nameError) errors.name = nameError;

  const contactError = validateGuestContact(contact, lang);
  if (contactError) errors.contact = contactError;

  if (
    attendanceStatus === 'attending' &&
    typeof selectedEventsCount === 'number' &&
    selectedEventsCount <= 0
  ) {
    errors.events =
      lang === 'en'
        ? 'Please select at least one ceremony you plan to attend.'
        : 'कृपया कम से कम एक कार्यक्रम का चयन करें।';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
