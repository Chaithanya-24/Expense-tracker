import { createAction, props } from '@ngrx/store';
import { Category } from '../category.model';

// Load categories
export const loadCategories = createAction('[Categories] Load Categories'
);

// Load categories success
export const loadCategoriesSuccess = createAction(
  '[Categories] Load Categories Success',
  props<{ categories: Category[] }>()
);

// Load categories failure
export const loadCategoriesFailure = createAction(
  '[Categories] Load Categories Failure',
  props<{ error: string }>()
);
