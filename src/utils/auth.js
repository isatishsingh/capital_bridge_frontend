const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
  return atob(padded);
};

export const decodeJwtPayload = (token) => {
  try {
    const [, payload] = token.split('.');
    if (!payload) {
      return null;
    }
    return JSON.parse(decodeBase64Url(payload));
  } catch {
    return null;
  }
};

const normalizeRole = (value) => {
  if (!value) {
    return '';
  }

  const raw = Array.isArray(value) ? value[0] : value;
  return String(raw).replace(/^ROLE_/i, '').toUpperCase();
};

export const normalizeUser = (user) => {
  if (!user || typeof user !== 'object') {
    return null;
  }

  const email = user.email || user.username || '';
  const role = normalizeRole(user.role ?? user.roles?.[0]) || String(user.role || '').toUpperCase();

  return {
    ...user,
    id: user.id ?? user.userId ?? null,
    name: user.name || user.fullName || user.username || (email ? email.split('@')[0] : 'Account'),
    email,
    role
  };
};

export const buildUserFromToken = (token, fallback = {}) => {
  const payload = decodeJwtPayload(token);
  const email = payload?.sub || payload?.email || fallback.email || '';
  const role = normalizeRole(payload?.role ?? payload?.roles) || fallback.role || '';
  const nameFromEmail = email ? email.split('@')[0] : 'Account';

  return {
    id: fallback.id || payload?.userId || payload?.id || null,
    name: fallback.name || payload?.name || nameFromEmail,
    email,
    role
  };
};
