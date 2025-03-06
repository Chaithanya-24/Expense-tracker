import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { provideStore } from '@ngrx/store';
import { categoriesReducer } from './features/categories/store/categories.reducer';
import { expensesReducer } from './features/expenses/store/expenses.reducer';
import { CategoriesEffects } from './features/categories/store/categories.effects';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(),
    provideClientHydration(withEventReplay()),
    provideEffects(CategoriesEffects),
    provideStore({ 
      categories: categoriesReducer,
      expenses: expensesReducer
     })
  ]
};
