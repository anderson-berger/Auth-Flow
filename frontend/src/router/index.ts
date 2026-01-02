import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import AuthService from 'src/services/AuthService';
import { LoadingBar } from 'quasar';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // Navigation Guard - Loading bar
  Router.beforeEach((to, _from, next) => {
    // Inicia loading bar
    LoadingBar.start();

    const isAuthenticated = AuthService.isAuthenticated();
    const isPrivateRoute = to.path.startsWith('/app');
    const isPublicRoute = !isPrivateRoute;

    // Se está autenticado e tentando acessar rota pública (exceto logout)
    if (isAuthenticated && isPublicRoute && to.path !== '/') {
      next({ name: 'dashboard' });
      return;
    }

    // Se não está autenticado e tentando acessar rota privada
    if (!isAuthenticated && isPrivateRoute) {
      next({ name: 'auth', query: { redirect: to.fullPath } });
      return;
    }

    next();
  });

  // Para o loading bar após navegação
  Router.afterEach(() => {
    LoadingBar.stop();
  });

  // Para o loading bar em caso de erro
  Router.onError(() => {
    LoadingBar.stop();
  });

  return Router;
});
