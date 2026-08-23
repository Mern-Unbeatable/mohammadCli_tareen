import { USER_ROLES } from '@/shared/constants/roles';

/** Demo accounts for local development — replace with API auth in production. */
export const DUMMY_ACCOUNTS = [
  {
    id: 'user-lab',
    email: 'user.lab@gmail.com',
    password: 'demo123',
    role: USER_ROLES.USER,
    name: 'Élise Moreau',
    title: 'Quality Control Manager',
    initials: 'EM',
    avatar:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqy5ShEFSxwHTFMoD48GNhTteRdlLb51azWU0ibObL5g&s=10',
  },
  {
    id: 'admin-lab',
    email: 'admin.lab@gmail.com',
    password: 'demo123',
    role: USER_ROLES.ADMIN,
    name: 'Atik Adnan',
    title: 'Platform Administrator',
    initials: 'AA',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face',
  },
  {
    id: 'supplier-lab',
    email: 'tradesman.lab@gmail.com',
    password: 'demo123',
    role: USER_ROLES.SUPPLIER,
    name: 'Atik Adnan',
    title: 'Equipment Supplier',
    initials: 'AA',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face',
  },
];

export const findAccountByCredentials = (email, password) =>
  DUMMY_ACCOUNTS.find(
    (account) =>
      account.email.toLowerCase() === email.trim().toLowerCase() &&
      account.password === password
  ) ?? null;

export const getDemoAccountsByRole = () =>
  DUMMY_ACCOUNTS.reduce((acc, account) => {
    acc[account.role] = account;
    return acc;
  }, {});
