export const currency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(value || 0));

export const compactCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(Number(value || 0));

export const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(new Date(value))
    : '-';

export const percent = (value) => `${Number(value || 0).toFixed(1)}%`;

export const progressFromAmounts = (current, goal) => {
  if (!goal) {
    return 0;
  }

  return Math.min(100, (Number(current || 0) / Number(goal || 1)) * 100);
};

export const roleLabel = (role) => {
  if (role === 'CREATOR') {
    return 'Customer';
  }
  if (role === 'INVESTOR') {
    return 'Investor';
  }
  if (role === 'ADMIN') {
    return 'Admin';
  }
  return role || 'User';
};

export const initialsFromName = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
