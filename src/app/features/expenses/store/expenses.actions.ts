import { createAction, props } from '@ngrx/store';
import { Expense } from '../models/expense.model';

// Action to add an expense
export const addExpense = createAction(
  '[Expense] Add Expense',
  props<{ expense: Expense }>()
);

// Action to remove an expense
export const removeExpense = createAction(
  '[Expense] Remove Expense',
  props<{ id: string }>()
);

// Action to load expenses (if using API)
export const loadExpenses = createAction('[Expense] Load Expenses');
