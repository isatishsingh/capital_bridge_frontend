const STATUS_MESSAGES = {
  400: 'The information you submitted is not valid. Please review the form and try again.',
  401: 'Your session has expired. Please sign in again.',
  403: 'You do not have permission to perform this action.',
  404: 'We could not find what you were looking for. It may have been removed.',
  408: 'The request took too long. Check your connection and try again.',
  409: 'This action conflicts with existing data. Refresh the page and try again.',
  422: 'Some fields need correction before we can continue.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'Our servers hit a problem. Please try again in a few minutes.',
  502: 'The service is temporarily unavailable. Please try again shortly.',
  503: 'The platform is under maintenance. Please try again later.'
};

const CODE_HINTS = {
  CREATOR_SUBSCRIPTION_REQUIRED:
    'Upgrade to Creator Membership to list more projects or raise more than ₹10,000.',
  INVESTOR_SUBSCRIPTION_REQUIRED:
    'Upgrade to Investor Membership to invest in more projects or above ₹10,000 per investment.',
  KYC_NOT_SUBMITTED: 'Complete verification (KYC) before creating a project.',
  KYC_PENDING:
    'Your verification is under admin review. You can create projects after approval.',
  KYC_REJECTED:
    'Your verification was not approved. Update your details and apply again.'
};

/** Shown when the API returns a known KYC duplicate code (even if message is missing). */
const PASSWORD_ERROR_MESSAGES = {
  PASSWORD_CURRENT_REQUIRED:
    'Enter your current password to set a new password.',
  PASSWORD_CURRENT_INVALID:
    'Current password is incorrect. Your password was not changed.'
};

export const KYC_DUPLICATE_MESSAGES = {
  KYC_PHONE_IN_USE:
    'This phone number is already registered with another account. Please use a different phone number.',
  KYC_PAN_IN_USE:
    'This PAN number is already registered with another account. Please enter your own PAN.',
  KYC_AADHAAR_IN_USE:
    'This Aadhaar number is already registered with another account. Please enter your own Aadhaar number.'
};

const parseErrorBody = (data) => {
  if (!data) {
    return null;
  }

  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return data.trim() ? { message: data } : null;
    }
  }

  return typeof data === 'object' ? data : null;
};

const NETWORK_PATTERNS = [/network error/i, /failed to fetch/i, /timeout/i, /econnrefused/i];

export const formatUserError = (error, fallback = 'Something went wrong. Please try again.') => {
  if (!error) {
    return fallback;
  }

  if (typeof error === 'string' && error.trim()) {
    return error;
  }

  const response = error.response;
  const data = parseErrorBody(response?.data);
  const status = response?.status;

  if (data) {
    if (data.code && KYC_DUPLICATE_MESSAGES[data.code]) {
      return KYC_DUPLICATE_MESSAGES[data.code];
    }

    if (data.code && PASSWORD_ERROR_MESSAGES[data.code]) {
      return PASSWORD_ERROR_MESSAGES[data.code];
    }

    if (typeof data.message === 'string' && data.message.trim()) {
      if (data.code && CODE_HINTS[data.code]) {
        return `${data.message} ${CODE_HINTS[data.code]}`;
      }
      return data.message;
    }

    if (typeof data.error === 'string' && data.error.trim() && data.error !== 'Forbidden') {
      return data.error;
    }

    if (Array.isArray(data.errors) && data.errors.length) {
      const first = data.errors[0];
      if (typeof first === 'string') {
        return first;
      }
      if (first?.defaultMessage) {
        return first.defaultMessage;
      }
    }

    if (data.errors && typeof data.errors === 'object') {
      const firstKey = Object.keys(data.errors)[0];
      const value = firstKey ? data.errors[firstKey] : null;
      if (Array.isArray(value) && value.length) {
        return `${firstKey}: ${value[0]}`;
      }
    }
  }

  if (status && STATUS_MESSAGES[status]) {
    return STATUS_MESSAGES[status];
  }

  const message = error.message || '';
  if (NETWORK_PATTERNS.some((pattern) => pattern.test(message))) {
    return 'Unable to reach the server. Make sure the backend is running and VITE_API_BASE_URL is correct.';
  }

  if (message && !message.startsWith('Request failed with status code')) {
    return message;
  }

  return fallback;
};

export const formatKycError = (error, fallback = 'Unable to save verification profile.') =>
  formatUserError(error, fallback);
