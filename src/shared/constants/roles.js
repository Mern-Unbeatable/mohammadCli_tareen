export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPPLIER: 'supplier',
};

export const ROLE_HOME_PATH = {
  [USER_ROLES.USER]: '/feed',
  [USER_ROLES.ADMIN]: '/admin',
  [USER_ROLES.SUPPLIER]: '/supplier',
};
