import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // Public routes (com PublicLayout)
  {
    path: '/',
    component: () => import('layouts/PublicLayout.vue'),
    children: [
      {
        path: '',
        name: 'landing',
        component: () => import('pages/public/LandingPage.vue'),
      },
      {
        path: '/auth/:from?',
        name: 'auth',
        component: () => import('pages/public/AuthPage.vue'),
        props: true,
      },
      {
        path: 'confirm-email',
        name: 'confirm-email',
        component: () => import('pages/public/ConfirmEmailPage.vue'),
      },
    ],
  },

  // Private routes (área logada com PrivateLayout)
  {
    path: '/app',
    component: () => import('layouts/PrivateLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('pages/private/DashboardPage.vue'),
      },
    ],
  },

  // Always leave this as last one
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
