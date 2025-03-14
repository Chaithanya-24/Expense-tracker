import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { expenseReducer } from './store/expense.reducer';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { categoryReducer } from './store/category.reducer';
import { CategoryEffects } from './store/category.effects';
import { provideEffects } from '@ngrx/effects';
import { TimeagoModule } from 'ngx-timeago';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideClientHydration(withEventReplay()), 
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: 'system',
          cssLayer: false,
        },
      },
    }),
    provideStore({ expenses: expenseReducer, categories: categoryReducer }),
    provideAnimationsAsync(),
    provideRouter(routes), 
    provideAnimationsAsync(),
    provideEffects([CategoryEffects]),
    importProvidersFrom(TimeagoModule.forRoot()),
    provideHttpClient()]
};
