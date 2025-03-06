import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { categoriesReducer } from '../features/categories/store/categories.reducer';
import { CategoriesEffects } from '../features/categories/store/categories.effects';
import { expensesReducer } from '../features/expenses/store/expenses.reducer';

export const appStoreProviders = [
  provideStore({
    categories: categoriesReducer,
    expenses : expensesReducer
  }), // Empty store for now
  provideEffects([CategoriesEffects]),  // Empty effects for now
  provideStoreDevtools()
];
