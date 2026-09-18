/**
 * Configuração global do Angular
 * - Router
 * - HttpClient + interceptor JWT
 * - Ícones Lucide (@ng-icons)
 */

import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideNgIconsConfig } from '@ng-icons/core';
import { routes } from './app.routes';
import { iconesPainelProvider } from './comum/icones-painel';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    iconesPainelProvider,
    provideNgIconsConfig({
      size: '1.15rem',
      strokeWidth: 2,
    }),
  ],
};
