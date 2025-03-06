import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { addExpense } from '../../store/expenses.actions';
import { Expense } from '../../models/expense.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css']
})
export class ExpenseFormComponent {
  store = inject(Store);

  title = '';
  amount: number | null = null;
  category = '';

  addExpense() {
    if (!this.title || !this.amount || !this.category) return;

    const newExpense: Expense = {
      id: uuidv4(),
      title: this.title,
      amount: this.amount,
      date: new Date().toISOString(),
      category: this.category
    };
    console.log(newExpense);
    this.store.dispatch(addExpense({ expense: newExpense }));

    // Reset form fields
    this.title = '';
    this.amount = null;
    this.category = '';
  }
}
