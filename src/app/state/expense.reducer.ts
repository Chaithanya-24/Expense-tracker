import { createReducer, on } from '@ngrx/store';
import { addExpense, deleteExpense, loadExpenses, updateExpense } from './expense.actions';
import { Expense } from './expense.model';

// Initial state
export interface ExpenseState {
  expenses: Expense[];
}

const initialState: ExpenseState = {
  expenses: [],
};

// Reducer function
export const expenseReducer = createReducer(
  initialState,
  
  // Load expenses (e.g., from API)
  on(loadExpenses, (state, { expenses }) => ({
    ...state,
    expenses: [...expenses],
  })),

  // Add a new expense
  on(addExpense, (state, { expense }) => ({
    ...state,
    expenses: [...state.expenses, expense],
  })),

  on(updateExpense, (state, { expense }) => ({
    ...state,
    expenses: state.expenses.map((e) => (e.id === expense.id ? expense : e))
  })),
  
  // Remove an expense
  on(deleteExpense, (state, { id }) => ({
    ...state,
    expenses: state.expenses.filter(exp => exp.id !== id),
  }))
);
