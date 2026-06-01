import { ROLES } from './constants';

export const getRoleLabel = (role) => {
  const normalized = String(role || '')
    .replace(/^ROLE_/i, '')
    .toUpperCase();

  if (normalized === ROLES.CREATOR) {
    return 'Customer';
  }
  if (normalized === ROLES.INVESTOR) {
    return 'Investor';
  }
  if (normalized === ROLES.ADMIN) {
    return 'Admin';
  }
  return normalized || 'User';
};

export const getMembershipPlanName = (role) => {
  const normalized = String(role || '')
    .replace(/^ROLE_/i, '')
    .toUpperCase();

  if (normalized === ROLES.CREATOR) {
    return 'Creator Membership';
  }
  if (normalized === ROLES.INVESTOR) {
    return 'Investor Membership';
  }
  return 'Membership';
};
