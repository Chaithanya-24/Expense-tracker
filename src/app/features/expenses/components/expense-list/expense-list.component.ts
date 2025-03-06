import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { removeExpense } from '../../store/expenses.actions';
import { selectAllExpenses } from '../../store/expenses.selectors';
import { Expense } from '../../models/expense.model';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, ExpenseFormComponent, FormsModule],
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent {
  store = inject(Store);
  expenses$ = this.store.select(selectAllExpenses);

  removeExpense(id: string) {
    this.store.dispatch(removeExpense({ id }));
  }
}
