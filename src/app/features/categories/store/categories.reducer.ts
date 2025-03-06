import { createReducer, on } from '@ngrx/store';
import { loadCategories, loadCategoriesSuccess, loadCategoriesFailure } from './categories.actions';
import { Category } from '../category.model';

export interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null
};

export const categoriesReducer = createReducer(
  initialState,
  on(loadCategories, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories,
    loading: false
  })),
  on(loadCategoriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
