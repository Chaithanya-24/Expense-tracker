import { createReducer, on } from '@ngrx/store';
import { addExpense, removeExpense } from './expenses.actions';
import { Expense } from '../models/expense.model';

export interface ExpenseState {
  expenses: Expense[];
}

const initialState: ExpenseState = {
  expenses: []
};

export const expensesReducer = createReducer(
  initialState,
  on(addExpense, (state, { expense }) => ({
    ...state,
    expenses: [...state.expenses, expense]
  })),
  on(removeExpense, (state, { id }) => ({
    ...state,
    expenses: state.expenses.filter(exp => exp.id !== id)
  }))
);
