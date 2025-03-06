import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Expense } from '../models/expense.model';

export interface ExpenseState {
  expenses: Expense[];
}

export const selectExpenseFeature = createFeatureSelector<ExpenseState>('expenses');

export const selectAllExpenses = createSelector(
  selectExpenseFeature,
  (state: ExpenseState) => state.expenses
);
