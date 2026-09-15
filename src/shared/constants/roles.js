export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPPLIER: 'SUPPLIER',
  user: 'USER',
  admin: 'ADMIN',
  supplier: 'SUPPLIER',
};

export const KNOWN_ROLES = Object.freeze(['USER', 'ADMIN', 'SUPPLIER']);

export const ROLE_HOME_PATH = {
  USER: '/feed',
  ADMIN: '/admin',
  SUPPLIER: '/supplier',
  user: '/feed',
  admin: '/admin',
  supplier: '/supplier',
};

export const ROLE_LABELS = {
  USER: 'User',
  ADMIN: 'Admin',
  SUPPLIER: 'Supplier',
};

/**
 * Canonical app role from a user payload.
 * Uses `role` only; maps profileType "supplier" → SUPPLIER as a narrow fallback.
 * Returns null when the role is missing or unknown (do not default to USER).
 */
export function normalizeAppRole(user) {
  if (!user) return null;

  // Support briefly corrupted cookie/envelope shape: { data: { role } }
  const source =
    user.role || user.email || user.id || user.profileType ? user : user.data || user;

  const fromRole = String(source?.role || '').trim().toUpperCase();
  if (KNOWN_ROLES.includes(fromRole)) return fromRole;

  const fromProfile = String(source?.profileType || '').trim().toUpperCase();
  if (fromProfile === 'SUPPLIER') return 'SUPPLIER';

  return null;
}

export function roleHomePath(role) {
  if (!role) return '/login';
  return ROLE_HOME_PATH[role] || ROLE_HOME_PATH[String(role).toUpperCase()] || '/login';
}

export function roleLabel(role) {
  const key = String(role || '').toUpperCase();
  return ROLE_LABELS[key] || 'User';
}
