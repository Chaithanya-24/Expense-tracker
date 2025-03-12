import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Expense } from '../../store/expense.model';
import { selectAllExpenses } from '../../store/expense.selectors';
import { Router, RouterModule } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { deleteExpense, updateExpense } from '../../store/expense.actions';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, DialogModule, ExpenseFormComponent, RouterModule, IconFieldModule, InputIconModule],
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent {
  private store = inject(Store);
  private router = inject(Router);
  expenses$: Observable<Expense[]> = this.store.select(selectAllExpenses);
  displayForm: boolean = false;  // Controls the dialog visibility
  displayDialog: boolean = false;
  selectedExpense: Expense | null = null;  

  showDialog(expense?: Expense) {
    if (expense) {
      this.selectedExpense = { ...expense }; // Clone to prevent direct mutation
    } else {
      this.selectedExpense = null; // New expense
    }
    this.displayDialog = true;
  }

  filterExpenses(event: any, dt: Table | null) {
    if (dt) {
      dt.filterGlobal(event.target.value, 'contains');
    }
  }
  closeDialog() {
    this.displayDialog = false;
    this.selectedExpense = null;
  }
  onUpdateExpense(expense: Expense) {
    this.showDialog(expense); // Open dialog in edit mode
  }

  onAddExpense() {
    this.router.navigate(['/add-expense']);
  }

  // onUpdateExpense(expense: Expense) {
  //   this.store.dispatch(updateExpense({ expense }));
  //   this.router.navigate(['/edit-expense', expense.id]); // Redirect after updating         
  //   // this.router.navigate(['/expenses']); // Redirect after updating
  // }

  onDelete(id: number) {
    this.store.dispatch(deleteExpense({ id }));
  }

}
