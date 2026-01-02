import type { QVueGlobals } from 'quasar';
import type { Router, RouteLocationNormalizedLoaded } from 'vue-router';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $q: QVueGlobals;
    $router: Router;
    $route: RouteLocationNormalizedLoaded;
  }
}

// Garante que o arquivo é tratado como módulo
export {};
