import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withFetch, HttpClient } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideLucideIcons } from '@lucide/angular';
import { provideTranslateService, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  LucideLayoutDashboard, LucideShoppingBag, LucidePackage, LucideChartBarBig,
  LucideBell, LucideSearch, LucideSettings, LucideLogOut, LucideMenu, LucideX,
  LucideChevronLeft, LucideChevronRight, LucideCoffee, LucideTrendingUp,
  LucideUsers, LucideDollarSign, LucideShoppingCart, LucideUserCheck, LucideUserX, LucideBoxes,
  LucideArrowUp, LucideArrowDown, LucideEye, LucidePencil, LucideTrash2,
  LucideFilter, LucideDownload, LucideCalendar, LucidePlus, LucideCheckCircle,
  LucideClock, LucideXCircle, LucideAlertCircle, LucideStar, LucideSparkles, LucideLock,
  LucideMapPin, LucidePhone, LucideStore, LucideWrench, LucideShieldCheck, LucideGlobe,
  LucideToggleLeft, LucideToggleRight, LucideSave, LucideRefreshCw
} from '@lucide/angular';

// Translation loader factory for @ngx-translate
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    './assets/i18n/',
    '.json'
  );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    
    // Translation Service Setup
    provideTranslateService({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    
    provideLucideIcons(
      LucideLayoutDashboard, LucideShoppingBag, LucidePackage, LucideChartBarBig,
      LucideBell, LucideSearch, LucideSettings, LucideLogOut, LucideMenu, LucideX,
      LucideChevronLeft, LucideChevronRight, LucideCoffee, LucideTrendingUp,
      LucideUsers, LucideDollarSign, LucideShoppingCart, LucideUserCheck, LucideUserX, LucideBoxes,
      LucideArrowUp, LucideArrowDown, LucideEye, LucidePencil, LucideTrash2,
      LucideFilter, LucideDownload, LucideCalendar, LucidePlus, LucideCheckCircle,
      LucideClock, LucideXCircle, LucideAlertCircle, LucideStar, LucideSparkles, LucideLock,
      LucideMapPin, LucidePhone, LucideStore, LucideWrench, LucideShieldCheck, LucideGlobe,
      LucideToggleLeft, LucideToggleRight, LucideSave, LucideRefreshCw
    )
  ]
};
