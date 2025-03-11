import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Expense } from '../../store/expense.model';
import { selectAllExpenses } from '../../store/expense.selectors';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { deleteExpense, updateExpense } from '../../store/expense.actions';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, DialogModule, ExpenseFormComponent],
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent {
  private store = inject(Store);
  private router = inject(Router);
  expenses$: Observable<Expense[]> = this.store.select(selectAllExpenses);
  displayForm: boolean = false;  // Controls the dialog visibility

  showDialog() {
    this.displayForm = true;
  }

  closeDialog() {
    this.displayForm = false;
  }

  onUpdateExpense(expense: Expense) {
    this.store.dispatch(updateExpense({ expense }));
    this.router.navigate(['/edit-expense', expense.id]); // Redirect after updating         
    // this.router.navigate(['/expenses']); // Redirect after updating
  }

  onDelete(id: number) {
    this.store.dispatch(deleteExpense({ id }));
  }

}
