import { ROLES } from './roles'

export const ROLE_NAVIGATION = {
  [ROLES.ADMIN]: [
    {
      key: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
    },
    {
      key: 'courses',
      label: 'Courses',
      path: '/courses',
    },
    {
      key: 'manage-employee',
      label: 'Manage Employees',
      path: '/manage-employee',
    },
    {
      key: 'templates',
      label: 'Templates',
      path: '/templates',
    },
    {
      key: 'learning-paths',
      label: 'Learning Paths',
      path: '/learning-paths/create',
    },
  ],
  [ROLES.MANAGER]: [
    {
      key: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
    },
    {
      key: 'courses',
      label: 'Manage Courses',
      path: '/courses',
    },
    {
      key: 'manage-employee',
      label: 'Manage Employees',
      path: '/manage-employee',
    },
    {
      key: 'templates',
      label: 'Manage Templates',
      path: '/templates',
    },
    {
      key: 'learning-paths',
      label: 'Create Learning Paths',
      path: '/learning-paths/create',
    },
  ],
  [ROLES.EMPLOYEE]: [
    {
      key: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
    },
    {
      key: 'my-learning-path',
      label: 'My Learning Path',
      path: '/my-learning-path',
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
