import { ROLES } from './roles'

export const ROLE_NAVIGATION = {
  [ROLES.ADMIN]: [
    {
      key: 'user-management',
      label: 'User Management',
      path: '/admin/users',
    },
    {
      key: 'feedback-management',
      label: 'Feedback Management',
      path: '/admin/feedbacks',
    },
  ],
  [ROLES.MANAGER]: [
    {
      key: 'manage-employee',
      label: 'Manage Employees',
      path: '/manage-employee',
    },
    {
      key: 'learning-paths',
      label: 'Create Learning Paths',
      path: '/learning-paths/create',
    },
    {
      key: 'courses',
      label: 'Manage Courses',
      path: '/courses',
    },
    {
      key: 'templates',
      label: 'Manage Templates',
      path: '/templates',
    },
  ],
}

export const DEFAULT_NAVIGATION = [
  {
    key: 'home',
    label: 'Home',
    path: '/',
  },
  {
    key: 'login',
    label: 'Login',
    path: '/login',
  },
]
